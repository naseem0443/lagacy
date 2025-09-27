# Ubuntu Server Deployment Guide for SHAAD-n-SHIFA

This comprehensive guide provides step-by-step instructions to deploy the SHAAD-n-SHIFA e-commerce website on Ubuntu Server with Nigerian localization.

## Prerequisites

- Ubuntu Server 20.04 or later
- Domain name (optional but recommended)
- Root or sudo access
- At least 2GB RAM and 20GB storage

## Step 1: Install Required Software

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (recommended for production)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install PostgreSQL 14
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Install build tools
sudo apt install build-essential -y
```

## Step 2: Setup PostgreSQL Database

```bash
# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user with proper security
sudo -u postgres psql

# In PostgreSQL prompt, run these commands:
# Create the database
CREATE DATABASE shaadnshifa;

# Create a regular user (NOT superuser) for the application
CREATE USER shaadnshifa WITH PASSWORD 'your_secure_password_here';

# Grant only necessary privileges on the specific database
GRANT CONNECT ON DATABASE shaadnshifa TO shaadnshifa;
GRANT USAGE ON SCHEMA public TO shaadnshifa;
GRANT CREATE ON SCHEMA public TO shaadnshifa;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO shaadnshifa;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO shaadnshifa;

# Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shaadnshifa;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO shaadnshifa;

# Exit PostgreSQL
\q
```

## Step 3: Database Schema and Data

Create a file called `database.sql` and add the following content:

```sql
-- Create tables
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url VARCHAR(500),
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  whatsapp_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Insert sample product data (Nigerian market pricing)
INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES 
('Premium Coral Kurta Set', 'Traditional cotton kurta with matching pajama in elegant coral color', 25000.00, 'cotton', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 10),
('Elegant Gray Kurta Set', 'Premium linen kurta with contemporary styling in comfortable gray', 35000.00, 'linen', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400', 8),
('Fresh Green Kurta', 'Soft cotton kurta perfect for casual occasions in refreshing green', 18000.00, 'cotton', 'https://images.unsplash.com/photo-1506629905607-c52b57c2b728?w=400', 12),
('Designer Plaid Kurta', 'Contemporary plaid pattern with traditional cut in premium fabric', 22000.00, 'cotton', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 6),
('Royal Blue Silk Kurta', 'Luxurious silk kurta with intricate embroidery for special occasions', 55000.00, 'silk', 'https://images.unsplash.com/photo-1566479179817-cc9e6aa8e34c?w=400', 5),
('Classic White Cotton Kurta', 'Timeless white cotton kurta with subtle details perfect for any occasion', 15000.00, 'cotton', 'https://images.unsplash.com/photo-1542392794-5a378f80d84c?w=400', 15),
('Burgundy Silk Kurta Set', 'Rich burgundy silk kurta with gold accents for festive wear', 65000.00, 'silk', 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400', 4),
('Cream Linen Kurta', 'Breathable cream linen kurta with modern fit for summer comfort', 28000.00, 'linen', 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400', 9);
```

Execute the database setup:

```bash
# Import the database
psql -U shaadnshifa -d shaadnshifa -f database.sql
```

## Step 4: Deploy the Application

```bash
# Create application directory
sudo mkdir -p /var/www/shaadnshifa
cd /var/www/shaadnshifa

# Clone your repository (replace with your actual repository URL)
sudo git clone https://github.com/yourusername/shaadnshifa.git .

# Set proper ownership
sudo chown -R $USER:$USER /var/www/shaadnshifa

# Install dependencies
npm install

# Build the application
npm run build

# Create environment file
nano .env
```

Add the following environment variables to `.env`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://shaadnshifa:your_password@localhost:5432/shaadnshifa
SESSION_SECRET=your_very_long_random_string_here
```

## Step 5: Setup PM2 Process Manager

```bash
# Start the application with PM2
pm2 start npm --name "shaadnshifa" -- run start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command

# Check application status
pm2 status
pm2 logs shaadnshifa
```

## Step 6: Configure Nginx Reverse Proxy

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/shaadnshifa
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle static files
    location /assets/ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/shaadnshifa /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

## Step 7: Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup automatic renewal
sudo systemctl enable certbot.timer
```

## Step 8: Setup Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (be careful not to lock yourself out)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check firewall status
sudo ufw status
```

## Step 9: Maintenance and Monitoring

### Regular Maintenance Commands

```bash
# Update application
cd /var/www/shaadnshifa
git pull origin main
npm install
npm run build
pm2 restart shaadnshifa

# Check logs
pm2 logs shaadnshifa
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Backup database
pg_dump -U shaadnshifa shaadnshifa > backup_$(date +%Y%m%d_%H%M%S).sql

# Monitor system resources
htop
df -h
free -h
```

### Database Backup Script

Create a backup script:

```bash
sudo nano /usr/local/bin/backup-shaadnshifa.sh
```

Add the following content:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/shaadnshifa"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U shaadnshifa shaadnshifa > $BACKUP_DIR/shaadnshifa_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "shaadnshifa_*.sql" -mtime +7 -delete

echo "Backup completed: shaadnshifa_$DATE.sql"
```

Make it executable and setup cron job:

```bash
sudo chmod +x /usr/local/bin/backup-shaadnshifa.sh

# Add to crontab (daily backup at 2 AM)
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-shaadnshifa.sh
```

## Troubleshooting

### Common Issues

1. **Application not starting:**
   ```bash
   pm2 logs shaadnshifa
   pm2 restart shaadnshifa
   ```

2. **Database connection issues:**
   ```bash
   sudo systemctl status postgresql
   psql -U shaadnshifa -d shaadnshifa -h localhost
   ```

3. **Nginx issues:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   tail -f /var/log/nginx/error.log
   ```

4. **Check if port 5000 is running:**
   ```bash
   netstat -tlnp | grep :5000
   ```

### System Requirements Verification

```bash
# Check system resources
free -h
df -h
node --version
npm --version
psql --version
nginx -v
```

## Security Recommendations

1. **Regular Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   npm audit fix
   ```

2. **Database Security:**
   - Use strong passwords
   - Limit database user permissions
   - Regular backups

3. **Nginx Security:**
   - Keep Nginx updated
   - Use SSL certificates
   - Configure rate limiting if needed

4. **System Security:**
   - Configure SSH key authentication
   - Disable root login
   - Use UFW firewall
   - Regular security updates

## Contact Information

For technical support:
- WhatsApp: +234 814 748 5879
- Website: https://hirenaseem.tech

---

**SHAAD-n-SHIFA Loom To Legacy** - Traditional Fashion E-commerce Platform

Deployment completed successfully! Your Nigerian traditional fashion store is now live and ready to serve customers.