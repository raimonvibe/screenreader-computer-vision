# Railway Deployment Guide

This guide explains how to deploy the screenreader-computer-vision application to Railway.

## Overview

The application consists of two services:
- **Backend**: Python FastAPI service with OCR capabilities
- **Frontend**: React/Vite application

## Deployment Options

### Option 1: Monorepo Deployment (Recommended)

Deploy both services from the root repository using the main `railway.toml` configuration:

1. **Connect Repository to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Deploy Services**
   ```bash
   # Deploy both services
   railway up
   ```

The root `railway.toml` will automatically deploy both frontend and backend services.

### Option 2: Individual Service Deployment

Deploy each service separately:

1. **Deploy Backend**
   ```bash
   cd web-app/screenreader-backend
   railway init
   railway up
   ```

2. **Deploy Frontend**
   ```bash
   cd web-app/screenreader-frontend
   railway init
   railway up
   ```

## Configuration Files

### Root Configuration (`railway.toml`)
- Defines both frontend and backend services
- Configures service dependencies
- Sets up environment variables for service communication

### Backend Configuration (`web-app/screenreader-backend/railway.toml`)
- Python 3.12 runtime
- System dependencies: tesseract-ocr, scrot, xvfb-run
- FastAPI with uvicorn server
- Port configuration via $PORT environment variable

### Frontend Configuration (`web-app/screenreader-frontend/railway.toml`)
- Node.js 18 runtime
- Vite build process
- Preview server for production
- API URL configuration via environment variables

## Environment Variables

### Backend Service
- `PORT`: Automatically provided by Railway
- `PYTHON_VERSION`: Set to "3.12"

### Frontend Service
- `PORT`: Automatically provided by Railway
- `NODE_VERSION`: Set to "18"
- `VITE_API_URL`: Automatically set to backend service URL

## Build Commands

### Backend
```bash
# Automatic via nixpacks
pip install -r requirements.txt
```

### Frontend
```bash
npm install
npm run build
```

## Start Commands

### Backend
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend
```bash
npm run preview
```

## System Dependencies

The backend service requires the following system packages for OCR functionality:
- `tesseract-ocr`: OCR engine
- `scrot`: Screen capture utility
- `xvfb-run`: Virtual display for headless operation

These are automatically installed via the `aptPkgs` configuration in the Railway TOML files.

## Troubleshooting

### Common Issues

1. **OCR Dependencies Not Found**
   - Ensure `aptPkgs` are correctly specified in railway.toml
   - Check Railway build logs for package installation errors

2. **Frontend API Connection Issues**
   - Verify `VITE_API_URL` environment variable is set
   - Check that backend service is running and accessible

3. **Port Configuration**
   - Railway automatically provides the `$PORT` environment variable
   - Ensure both services use `$PORT` in their start commands

### Build Logs
```bash
# View build logs
railway logs --service backend
railway logs --service frontend
```

### Service Status
```bash
# Check service status
railway status
```

## Production Considerations

1. **CORS Configuration**: Ensure backend allows requests from frontend domain
2. **Environment Variables**: Set any additional environment variables in Railway dashboard
3. **Monitoring**: Use Railway's built-in monitoring and logging
4. **Scaling**: Configure auto-scaling based on usage patterns

## Migration from Other Platforms

If migrating from Render.com or other platforms:
1. Export environment variables from current platform
2. Update any platform-specific configurations
3. Test deployment in Railway staging environment
4. Update DNS records to point to Railway domains

## Support

For Railway-specific issues:
- Railway Documentation: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Railway GitHub: https://github.com/railwayapp/railway

For application-specific issues:
- Check application logs via `railway logs`
- Review build output for dependency issues
- Verify environment variable configuration
