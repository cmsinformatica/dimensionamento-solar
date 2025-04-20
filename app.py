
import streamlit as st
from jinja2 import Template
from datetime import datetime
import base64
from banco import criar_tabela, salvar_relatorio, listar_relatorios, carregar_relatorio_por_id
import pandas as pd
from io import BytesIO

criar_tabela()

st.set_page_config(page_title="Dimensionamento Solar", layout="centered")
st.title("Calculadora de Kit Solar")

st.subheader("Dados do projeto")
nome = st.text_input("Nome do projeto")
localizacao = st.text_input("Localização")
consumo_mensal = st.number_input("Consumo mensal (kWh)", min_value=0.0)
irradiacao = st.number_input("Irradiação local (kWh/m²/dia)", min_value=1.0, value=5.0)
potencia_painel = st.selectbox("Potência dos painéis (W)", [330, 400, 450])

logo = st.file_uploader("Logotipo da empresa (opcional)", type=["png", "jpg", "jpeg"])
logo_base64 = ""
if logo is not None:
    logo_bytes = logo.read()
    logo_base64 = base64.b64encode(logo_bytes).decode('utf-8')

if st.button("Gerar Relatório"):
    potencia_necessaria = consumo_mensal / (irradiacao * 30)
    perdas = 1.2
    potencia_com_perdas = potencia_necessaria * perdas
    num_modulos = round((potencia_com_perdas * 1000) / potencia_painel)
    area_total = num_modulos * 1.9
    peso_total = num_modulos * 20
    inversor_min = round(potencia_necessaria * 0.9, 1)
    inversor_max = round(potencia_com_perdas * 1.1, 1)

    dados = {
        "NOME_PROJETO": nome,
        "LOCALIZACAO": localizacao,
        "DATA": datetime.today().strftime("%d/%m/%Y"),
        "CONSUMO_MENSAL": consumo_mensal,
        "IRRADIACAO": irradiacao,
        "POTENCIA_NECESSARIA": round(potencia_necessaria, 2),
        "POTENCIA_COM_PERDAS": round(potencia_com_perdas, 2),
        "POTENCIA_PAINEL": potencia_painel,
        "NUM_MODULOS": num_modulos,
        "AREA_TOTAL": round(area_total, 2),
        "PESO_TOTAL": peso_total,
        "INVERSOR_MIN": inversor_min,
        "INVERSOR_MAX": inversor_max,
        "LOGO_BASE64": logo_base64,
    }

    salvar_relatorio(nome, localizacao, dados)

    with open("template_relatorio.html", "r") as file:
        template_html = file.read()
    html = Template(template_html).render(dados)

    st.components.v1.html(html, height=800, scrolling=True)

    st.download_button("Download HTML", data=html, file_name="relatorio.html", mime="text/html")

    df = pd.DataFrame([{
        "Projeto": nome,
        "Localização": localizacao,
        "Data": dados["DATA"],
        "Consumo Mensal (kWh)": consumo_mensal,
        "Irradiação": irradiacao,
        "Potência Necessária (kW)": potencia_necessaria,
        "Potência com Perdas (kW)": potencia_com_perdas,
        "Painel (W)": potencia_painel,
        "Nº de Módulos": num_modulos,
        "Área Total (m²)": area_total,
        "Peso Total (kg)": peso_total,
        "Inversor Mín (kW)": inversor_min,
        "Inversor Máx (kW)": inversor_max
    }])

    excel_buffer = BytesIO()
    df.to_excel(excel_buffer, index=False, engine='openpyxl')
    excel_buffer.seek(0)
    st.download_button("Download dos dados (Excel)", data=excel_buffer, file_name="relatorio.xlsx", mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

st.subheader("Relatórios salvos")
relatorios = listar_relatorios()
if relatorios:
    opcoes = {f"{r[1]} - {r[2]} ({r[3]})": r[0] for r in relatorios}
    escolha = st.selectbox("Selecione um relatório salvo", list(opcoes.keys()))
    if escolha:
        dados_salvos = carregar_relatorio_por_id(opcoes[escolha])
        if dados_salvos:
            with open("template_relatorio.html", "r") as file:
                template_html = file.read()
            html_salvo = Template(template_html).render(dados_salvos)
            st.components.v1.html(html_salvo, height=800, scrolling=True)
else:
    st.info("Nenhum relatório salvo ainda.")
