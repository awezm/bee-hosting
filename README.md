# Bee Hosting – Projects Landing

Static landing page served by Nginx, deployed via Dokploy. Projects are rendered from `data/projects.json`.

## Local preview
Open `index.html` directly in your browser.

## Updating projects
Edit `data/projects.json` and push to Git. If Auto Deploy is enabled in Dokploy, your site will update automatically.

## Docker (local)
```bash
docker build -t bee-landing .
docker run -p 8080:80 bee-landing
# open http://localhost:8080
```

## Dokploy settings
- Build Type: Dockerfile
- Build Path: /
- Docker File: Dockerfile
- Internal Port: 80
- Set your domain in the Domains tab
- If repo is private: add Dokploy's SSH deploy key in GitHub (read-only)
