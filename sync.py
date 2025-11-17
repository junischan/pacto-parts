#!/data/data/com.termux/files/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import json
import csv
import sys

SUPABASE_URL = 'https://yaluvzngjqppkmafygxo.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbHV2em5nanFwcGttYWZ5Z3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDE0NzcsImV4cCI6MjA0NzAxNzQ3N30.3mQkDD65uWtcP2PfJMdQJIdlDPnEcuYPfQntzHKOVKw'
TABLA = 'products'

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

def subir_csv(archivo):
    """Sube productos desde CSV a Supabase"""
    print(f"📁 Leyendo: {archivo}\n")
    
    exitosos = 0
    errores = 0
    
    try:
        with open(archivo, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                # Limpiar valores vacíos
                data = {k: (v if v else None) for k, v in row.items()}
                
                try:
                    response = requests.post(
                        f'{SUPABASE_URL}/rest/v1/{TABLA}',
                        headers=HEADERS,
                        json=data
                    )
                    
                    if response.status_code in [200, 201]:
                        exitosos += 1
                        print(f"✅ [{exitosos}] {data.get('name', 'Sin nombre')}")
                    else:
                        errores += 1
                        print(f"❌ Error {response.status_code}: {response.text}")
                
                except Exception as e:
                    errores += 1
                    print(f"❌ Error: {e}")
        
        print(f"\n📊 Exitosos: {exitosos} | Errores: {errores}")
    
    except FileNotFoundError:
        print(f"❌ Archivo no encontrado: {archivo}")
    except Exception as e:
        print(f"❌ Error leyendo CSV: {e}")


def traer_productos(archivo='productos.csv'):
    """Descarga productos y los guarda en CSV"""
    print("⬇️  Descargando productos...\n")
    
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/{TABLA}?select=*&order=created_at.desc',
            headers=HEADERS
        )
        
        if response.status_code == 200:
            productos = response.json()
            
            if len(productos) == 0:
                print("⚠️  No hay productos en la base de datos")
                return
            
            # Escribir CSV
            with open(archivo, 'w', encoding='utf-8', newline='') as f:
                headers = productos[0].keys()
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writeheader()
                writer.writerows(productos)
            
            print(f"✅ {len(productos)} productos descargados a: {archivo}")
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
    
    except Exception as e:
        print(f"❌ Error: {e}")


def listar():
    """Lista últimos productos"""
    print("📦 Últimos productos:\n")
    
    try:
        response = requests.get(
            f'{SUPABASE_URL}/rest/v1/{TABLA}?select=id,name,price,category&order=created_at.desc&limit=10',
            headers=HEADERS
        )
        
        if response.status_code == 200:
            productos = response.json()
            
            if len(productos) == 0:
                print("⚠️  No hay productos")
                return
            
            for p in productos:
                print(f"ID: {p.get('id', 'N/A')}")
                print(f"Nombre: {p.get('name', 'Sin nombre')}")
                print(f"Precio: ${p.get('price', 0)}")
                print(f"Categoría: {p.get('category', 'N/A')}")
                print("-" * 40)
        else:
            print(f"❌ Error {response.status_code}")
    
    except Exception as e:
        print(f"❌ Error: {e}")


def menu():
    """Menú interactivo"""
    print("\n" + "="*50)
    print("🐉 PACTO.PARTS - Sync Tool")
    print("="*50)
    print("\n1. Subir CSV a Supabase")
    print("2. Descargar productos a CSV")
    print("3. Listar últimos 10 productos")
    print("4. Salir")
    
    opcion = input("\nOpción (1-4): ")
    
    if opcion == "1":
        archivo = input("Nombre del CSV: ")
        subir_csv(archivo)
    elif opcion == "2":
        traer_productos()
    elif opcion == "3":
        listar()
    elif opcion == "4":
        print("👋 ¡Chau!")
        sys.exit()
    else:
        print("❌ Opción inválida")
    
    input("\nEnter para continuar...")
    menu()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "subir" and len(sys.argv) > 2:
            subir_csv(sys.argv[2])
        elif cmd == "traer":
            traer_productos()
        elif cmd == "listar":
            listar()
        else:
            print("Uso: python sync.py [subir archivo.csv | traer | listar]")
    else:
        menu()
