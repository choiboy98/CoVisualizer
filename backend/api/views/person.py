from flask import Blueprint, request, json
from api.core import create_response, serialize_list, logger
import psycopg2
import os
from config import config
from datetime import datetime

person = Blueprint("person", __name__)


@person.route("/person", methods=["GET"])
def get_person():
    """
    get person based on net_id
    """
    # gets database values from query string, if missing is None
    data = request.form
    if data is None:
        return create_response(status=400, message="No body provided for new person")
    net_id = data.get("net_id")
    sql = """SELECT * FROM person WHERE net_id = %s;"""
    conn = None
    items = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (net_id,))
        items = cur.fetchone()
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()
    output = {"net_id": items[0], "name": items[1], "email": items[2], "phone": items[3], "infected": items[4]}

    return create_response(
        status=200,
        data=output,
    )


@person.route("/person/<id>", methods=["PUT"])
def update_person(id):
    """
    update infected status for specified person
    """
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for person")

    is_infected = data.get("infected")
    sql = """ UPDATE person
                SET infected = %s
                WHERE net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (is_infected, id))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="updated successfully")


@person.route("/person", methods=["POST"])
def create_new_person():
    """
    create new person upon signing up
    """
    data = request.form
    print(data)
    if data is None:
        return create_response(status=400, message="No body provided for new person")
    net_id = data.get("net_id")
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    infected = data.get("infected")
    sql = "INSERT INTO person(net_id, name, email, phone, infected) VALUES(%s, %s, %s, %s, %s);"
    conn = None

    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (net_id, name, email, phone, infected))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="successfully added new user")