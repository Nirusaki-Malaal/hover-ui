from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="My First API",description="E-Commerce System")

templates = Jinja2Templates(directory="templates")

app.mount("/statics", StaticFiles(directory="statics"), name="statics")

@app.get("/")
async def root(request: Request): # Request object must be passed i guess
    return templates.TemplateResponse(name="homepage.html", request=request, context={}) # request must be passed
