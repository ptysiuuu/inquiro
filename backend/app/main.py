import uvicorn
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("inquiro-ddef8-firebase-adminsdk-fbsvc-bca8667a34.json")
firebase_admin.initialize_app(cred)

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
