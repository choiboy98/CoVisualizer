from flask import Blueprint, request, json
from api.core import create_response, serialize_list, logger
import psycopg2
import os
from config import config
from datetime import datetime

location = Blueprint("location", __name__)


@location.route("/location", methods=["GET"])
def get_location():
    """
    get location based on net_id
    """
    # gets database values from query string, if missing is None
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for person")
    coordinates = data.get("coordinates")
    
    sql = """SELECT * FROM location WHERE coordinates=%s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates,))
        items = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(
        status=200,
        data={items},
    )


@location.route("/location/<coordinates>", methods=["PUT"])
def update_location(id):
    """
    update infected status for specified location
    """
    data = request.form

    if data is None:
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

    if data is None:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    net_id = data.get("net_id")
    risk = data.get("risk")
    location_name = data.get("location_name")
    time_spent = data.get("time_spent")
    sql = """INSERT INTO location
             VALUES(%s, %s, %d, %s, %d);"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, net_id, risk, location_name, time_spent))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="successfully added new location")

@location.route("/location/<id>", methods=["DELETE"])
def delete_location():
    """
    create new location upon finish tracking
    """
    data = request.form

    if data is None:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    net_id = data.get("net_id")
    sql = """DELETE FROM location WHERE coordinates = %s AND net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, net_id))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="successfully deleted location")