from pymongo import MongoClient

def get_db():
    try:
        client = MongoClient("mongodb+srv://fabriziojimenez:3RKqh5KqMzU239BH@cluster0.ufrjots.mongodb.net/?retryWrites=true&w=majority")
        db = client["EcoCoinsCampus"]  # 👈 asegúrate de usar exactamente el mismo nombre de tu base
        print("✅ Conectado exitosamente a la base de datos EcoCoinsCampus")
        return db
    except Exception as e:
        print("❌ Error al conectar con MongoDB Atlas:", e)
        return None
