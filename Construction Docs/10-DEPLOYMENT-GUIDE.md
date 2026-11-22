# 🚢 Deployment Guide — SyncWrite

> Complete production deployment guide for SyncWrite.
> Also available at project root: [DEPLOYMENT.md](file:///e:/syncWrite/DEPLOYMENT.md)

---

## Summary of Environment Variables

Create `.env` with:

```ini
NODE_ENV=production
PORT=3001
CLIENT_URL=https://syncwrite.yourdomain.com

JWT_ACCESS_SECRET=your_generated_64_char_hex_secret
JWT_REFRESH_SECRET=your_generated_different_64_char_hex_secret
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

DATA_DIR=../data
PROJECTS_DIR=../projects
```

---

## Quick Production Commands

```bash
# 1. Build everything
npm run build

# 2. Test integration
npm test

# 3. Start unified production server
npm start
```

For full VPS setup instructions, Nginx WebSocket configurations, PM2 scripts, and backup procedures, refer to [DEPLOYMENT.md](file:///e:/syncWrite/DEPLOYMENT.md).
