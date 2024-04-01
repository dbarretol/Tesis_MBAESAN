#%% Importando librerias
import pandas as pd
import hashlib
import re

#%% Variables globales
list1 = r'C:\D_DevBox\TESIS_MBA\ScrapRepos\RawItemData\ALICIA_ItemsInfo.json'
list2= r'C:\D_DevBox\TESIS_MBA\ScrapRepos\RawItemData\RENATI_ItemsInfo.json'

#%% Definicion de funciones
def normalize_string(s):
    # Eliminar signos de puntuación y convertir todo a minúsculas
    s = re.sub(r'\W+', '', s).lower()
    return s

def normalize_title(title):
    # Normalizar el título
    return normalize_string(title)

def normalize_authors(authors):
    # Dividir los nombres de los autores y ordenarlos alfabéticamente
    author_list = sorted([normalize_string(author) for author in authors.split(';')])
    
    # Unir los nombres de los autores separados por un punto y coma
    normalized_authors = ';'.join(author_list)
    return normalized_authors

def generate_unique_id(title, authors):
    # Normalizar la columna TITULO y la columna AUTORES
    normalized_title = normalize_title(title)
    normalized_authors = normalize_authors(authors)
    
    # Generar un código único solo para el título
    title_id = hashlib.md5(normalized_title.encode()).hexdigest()
    
    # Generar un código único solo para los autores
    authors_id = hashlib.md5(normalized_authors.encode()).hexdigest()
    
    # Concatenar la columna TITULO y la columna AUTORES en una sola cadena
    combined_string = normalized_title + '|' + normalized_authors
    
    # Generar un código único para el registro completo
    unique_id = hashlib.md5(combined_string.encode()).hexdigest()
    return title_id, authors_id, unique_id


#%% Programa principal

#================================Cargando datos
A_records =pd.read_json(list1)

R_records =pd.read_json(list2)
#===============================Reorganizando columnas
col_ord1 = ['URL:','Enlace del recurso:','Formato:',
            'Repositorio:','Institución:','Título:',
            'Autor:','Fecha de Publicación:',
            'Lenguaje:','OAI Identifier:','Nivel de acceso:','Materia:' ]
col_ord2 = ['Enlace al repositorio:','Aparece en las colecciones:',
            'Institución:', 'Institución que otorga el grado o título:',
            'Disciplina académico-profesional:','Grado o título:',
            'Título:','Autor(es):', 'Asesor(es):','Fecha de publicación:',
            'Palabras clave:',
            'Resumen:','Fecha de registro:',  'Campo OCDE:',
            'Jurado:', 'Nota:', 'Otros títulos:', 'Identificador DOI:']

A_records = A_records.reindex(columns=col_ord1)
R_records = R_records.reindex(columns=col_ord2)

#%%Generando identificadores unicos para: autor/ titulo/autor+titulo
# Aplicar las funciones a las columnas correspondientes
A_records['title_id'], A_records['authors_id'], A_records['unique_id'] = zip(*A_records.apply(lambda row: generate_unique_id(row['Título:'], row['Autor:']), axis=1))

R_records['title_id'], R_records['authors_id'], R_records['unique_id'] = zip(*R_records.apply(lambda row: generate_unique_id(row['Título:'], row['Autor(es):']), axis=1))

#%% Guardando los dataframes
A_records.to_excel("./RepoItems/ALICIA_Records.xlsx", index = False)
R_records.to_excel("./RepoItems/RENATI_Records.xlsx", index = False)

