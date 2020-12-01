from flask import Blueprint, request, json
from api.core import create_response, serialize_list, logger
import psycopg2
import os
from config import config
from datetime import datetime

location = Blueprint("location", __name__)


@location.route("/get_location", methods=["POST"])
def get_location():
    """
    get location based on net_id
    """
    # gets database values from query string, if missing is None
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for person")
    coordinates = data.get("coordinates")
    net_id = data.get("net_id")

    sql = """SELECT * FROM location WHERE coordinates=%s AND net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, net_id))
        items = cur.fetchone()
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    output = {"coordinates": items[0], "net_id": items[1], "risk": items[2], "location_name": items[3], "time_spent": items[4]}

    return create_response(
        status=200,
        data=output,
    )


@location.route("/location/<coordinates>", methods=["PUT"])
def update_location(coordinates):
    """
    update infected status for specified location
    """
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for location")

    risk = data.get("risk")
    sql = """ UPDATE location
                SET risk = %s
                WHERE coordinates = %s"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (risk, coordinates))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="updated successfully")


@location.route("/location", methods=["POST"])
def create_new_location():
    """
    create new location upon finish tracking
    """
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    net_id = data.get("net_id")
    risk = data.get("risk")
    location_name = data.get("location_name")
    time_spent = data.get("time_spent")
    sql = """INSERT INTO location
             VALUES(%(coordinates)s, %(net_id)s, %(risk)s, %(location_name)s, %(time_spent)s);"""
    conn = None
    items = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        print(data)
        cur.execute(sql, data)
        # items = cur.fetchone()
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    # output = {"id": items[0], "coordinates": items[1], "net_id": items[2], "risk": items[3], "location_name": items[4], "time_spent": items[5]}
    return create_response(status=200, message="successfully added new location")

@location.route("/location/<id>", methods=["DELETE"])
def delete_location(id):
    """
    create new location upon finish tracking
    """
    data = request.form
    print(request.json)
    print(request.values)
    print(request.args)
    print(id)
    print(data)

    if len(data) == 0:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    sql = """DELETE FROM location WHERE coordinates = %s AND net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, id))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="successfully deleted location")