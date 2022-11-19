import ibm_db
from ..config.db_config import get_db_credential

conn=ibm_db.connect(get_db_credential(),"","")

def run_sql_select(query,params=None):
    try:
        stmt=ibm_db.prepare(conn,query)
        if(params==None):
            ibm_db.execute(stmt)
        else:
            ibm_db.execute(stmt,params)
        row = ibm_db.fetch_assoc(stmt)
        data = []
        while(row):
            data.append(row)
            row = ibm_db.fetch_assoc(stmt)
        return data
    except: 
        return False

def run_sql_insert(query,params):
    try:
        stmt=ibm_db.prepare(conn,query)
        ibm_db.execute(stmt,params)
        return True
    except:
        return False

def run_sql_update(query, params):
    try:
        stmt=ibm_db.prepare(conn, query)
        ibm_db.execute(stmt, params)
        return True

    except:
        return False

def run_sql_delete(query, params):
    try:
        stmt=ibm_db.prepare(conn, query)
        ibm_db.execute(stmt, params)
        return True

    except:
        return False