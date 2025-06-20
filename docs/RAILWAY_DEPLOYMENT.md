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
   
   # Initialize project from root directory
   railway init
   ```

2. **Deploy Backend Service**
   ```bash
   # Deploy backend from root directory
   railway up
   
   # OR deploy from backend directory
   cd web-app/screenreader-backend
   railway up
   ```

3. **Deploy Frontend Service (Optional)**
   ```bash
   # Deploy frontend from frontend directory
   cd web-app/screenreader-frontend
   railway up
   ```

**Note**: The root directory is configured for backend deployment. For frontend deployment, use the frontend directory.

## Configuration Structure

Railway uses the `nixpacksPlan` field within `railway.toml` files to configure system dependencies and build processes. The configuration structure follows Railway's current documentation format.

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
- Configured for backend deployment with nixpacksPlan structure
- System dependencies: tesseract-ocr, scrot, xvfb for OCR functionality
- Uses Railway's current configuration format with nixpacksPlan field

### Backend Configuration (`web-app/screenreader-backend/railway.toml`)
- Python 3.12 runtime
- System dependencies: tesseract-ocr, scrot, xvfb
- FastAPI with uvicorn server
- Port configuration via $PORT environment variable
- Uses nixpacksPlan field for system package configuration

### Frontend Configuration (`web-app/screenreader-frontend/railway.toml`)
- Node.js 18 runtime
- Vite build process via nixpacksPlan install phase
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
- `xvfb`: Virtual display for headless operation (provides xvfb-run command)

These are automatically installed via the `aptPkgs` configuration in the Railway TOML files.

## Troubleshooting

### Common Issues

1. **"No start command could be found" Error**
   - Ensure `startCommand` is properly defined in the `[deploy]` section
   - Verify railway.toml uses the correct nixpacksPlan structure
   - Remove any conflicting nixpacks.toml files (Railway expects configuration in railway.toml)

2. **OCR Dependencies Not Found**
   - Ensure `aptPkgs` are correctly specified in nixpacksPlan phases.setup
   - Check Railway build logs for package installation errors
   - Verify nixpacksPlan structure follows Railway's current format

3. **Frontend API Connection Issues**
   - Verify `VITE_API_URL` environment variable is set
   - Check that backend service is running and accessible

4. **Port Configuration**
   - Railway automatically provides the `$PORT` environment variable
   - Ensure both services use `$PORT` in their start commands

5. **Configuration File Conflicts**
   - Remove any separate nixpacks.toml files
   - Use only railway.toml with embedded nixpacksPlan configuration
   - Ensure builder is set to "NIXPACKS" (uppercase)

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
