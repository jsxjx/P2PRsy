import MySQLdb

from django.shortcuts import render

host = "10.141.245.16"
user = "bigdata"
passwd = "1234567890aAa"
db = "p2p_rsy"


def index(request):
    
    connect = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
    cursor = connect.cursor()

    sql = "select * from list_attr limit 1000"
    cursor.execute(sql)
    loans = cursor.fetchall()
    context = {"loans":[],}
    for loan in loans:
        loan_id = loan[0]
        loan_amount = loan[1]
        loan_rate = loan[2]
        sql = "select * from bid where list_id={0} and time<=0.5".format(loan[0])
        investiment_amount = 0
        cursor.execute(sql)
        bids = cursor.fetchall()
        for bid in bids:
            investiment_amount += bid[2]
        if investiment_amount > loan_amount:
            investiment_amount = loan_amount
        loan_dict = {"loan_id": loan_id,
                     "loan_amount": loan_amount,
                     "loan_rate": "%.2f%%" % (100.0 * loan_rate),
                     "loan_progress": "%.0f%%" % (100.0 * investiment_amount / loan_amount),}
        if 100.0 * investiment_amount / loan_amount >= 30:
            context["loans"].append(loan_dict)
    connect.close()
    return render(request, 'p2p_website/index.html', context)

def user_info(request, user_id):
    connect = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
    cursor = connect.cursor()

    connect.close()
    return render(request, 'p2p_website/user_info.html')

def loan_info(request, loan_id):
    
    connect = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
    cursor = connect.cursor()
    
    sql = "select * from list_attr where list_id={0}".format(loan_id)
    cursor.execute(sql)
    try:
        loan = cursor.fetchall()[0]
    except:
        return HttpRequest("Loan does not exist")
    context = {"loan": {}, "bids": []}
    context["loan"]["loan_id"] = loan[0]
    context["loan"]["loan_amount"] = loan[1]
    context["loan"]["loan_rate"] = "%.2f" % (loan[2] * 100.0)

    sql = "select * from bid where list_id = {0}".format(loan_id)
    cursor.execute(sql)
    bids = cursor.fetchall()
    for bid in bids:
        bid_dict = {"user_id": bid[1],
                    "bid_amount": bid[2],
                    "bid_time": bid[3],}
        context["bids"].append(bid_dict)
    connect.close()
    return render(request, 'p2p_website/loan_info.html', context)
