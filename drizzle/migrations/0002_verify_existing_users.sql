-- One-time: mark all existing users as email-verified so they are not locked out
UPDATE users SET email_verified = true WHERE email_verified = false;
