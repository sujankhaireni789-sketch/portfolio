# Sujan Giri Portfolio

This is a PHP-backed portfolio with an HTML/CSS/JavaScript frontend and a MySQL contact-message store. The pages remain static HTML; the contact form uses PHP endpoints to validate and save messages.

## Requirements

- PHP 8.1 or newer with PDO MySQL enabled
- MySQL 8 or a compatible MariaDB server
- Apache, Nginx, or another web server configured to run PHP

## Run Locally With XAMPP

1. Install XAMPP, then start Apache and MySQL from the XAMPP Control Panel.
2. Place this `portfolio` folder inside XAMPP's `htdocs` folder.
3. Open `http://localhost/phpmyadmin`, select **Import**, and import `database/schema.sql`. This creates the `sujan_portfolio` database and `contact_messages` table.
4. From the project folder, run `Copy-Item config/database.example.php config/database.php` in PowerShell. Edit `config/database.php` with your local MySQL host, database, username, and password. The default values in the example match a typical local XAMPP installation only.
5. Open `http://localhost/portfolio/contact/` and submit a test message. Use phpMyAdmin to view rows in `sujan_portfolio.contact_messages`.

Do not open the HTML files directly or use a static-only preview server: PHP endpoints require a PHP-enabled web server. `pdo_mysql` must be enabled in the PHP installation.

## Contact Form

`csrf-token.php` provides a session-bound CSRF token. `contact-submit.php` validates the request, applies a basic per-session submission delay, ignores bot submissions caught by the honeypot field, and inserts valid messages using a prepared PDO statement. The browser displays success or error feedback without navigating away.

Messages are saved in MySQL; the backend does not send email and there is no admin dashboard. Review or delete messages through a database administration tool. Database credentials belong in the ignored `config/database.php`, not in source control. For production, use a dedicated database user with access only to this database, HTTPS, and a web-server rule that blocks direct access to the `config` directory (the included `.htaccess` covers Apache).

Static-only hosts such as GitHub Pages cannot run this backend. Deploy the project to a host that supports PHP and MySQL, and configure its database credentials and schema before enabling the contact form.
