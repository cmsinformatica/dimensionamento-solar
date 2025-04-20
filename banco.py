
import sqlite3
import json
from datetime import datetime

def conectar():
    return sqlite3.connect("relatorios.db")

def criar_tabela():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS relatorios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            local TEXT,
            data TEXT,
            dados_json TEXT
        )
    """)
    conn.commit()
    conn.close()

def salvar_relatorio(nome, local, dados_dict):
    conn = conectar()
    cursor = conn.cursor()
    data = datetime.today().strftime("%Y-%m-%d %H:%M")
    dados_json = json.dumps(dados_dict)
    cursor.execute("INSERT INTO relatorios (nome, local, data, dados_json) VALUES (?, ?, ?, ?)",
                   (nome, local, data, dados_json))
    conn.commit()
    conn.close()

def listar_relatorios():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, local, data FROM relatorios ORDER BY data DESC")
    relatorios = cursor.fetchall()
    conn.close()
    return relatorios

def carregar_relatorio_por_id(relatorio_id):
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute("SELECT dados_json FROM relatorios WHERE id = ?", (relatorio_id,))
    resultado = cursor.fetchone()
    conn.close()
    return json.loads(resultado[0]) if resultado else None
