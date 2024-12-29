# type: ignore 
class Supplies(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # Type Fk
    type = models.ForeignKey(Type,on_delete=models.CASCADE,default="")
    # Supply Name
    supply_name = models.CharField(max_length=50,primary_key=True)
    # Countity
    countity = models.IntegerField(default=0)
    # Buy Price
    buy_price = models.IntegerField(default=0)
    # Sell Price
    sell_price = models.IntegerField(default=0)
    # BarCode
    # Later
    def __str__(self):
        return f'{self.supply_name}'
 
class DispatchSupply(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    supply = models.ForeignKey(Supplies,on_delete=models.CASCADE,default="")
    countity = models.IntegerField(default=0)
    buy_price = models.IntegerField(default=0)
    dispatch_date = models.DateField(auto_now=True)
    reason = models.CharField(max_length=400,null=True,blank=True)

    def __str__(self):
        return f'{self.supply} Countity: {self.countity}'
#Creating the Permanant Customer Model /Done/
class CustomerName(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=50,primary_key=True)
    total_debt = models.IntegerField(null=True,blank=True,default=0)
    
    def __str__(self):
        return f'{self.customer_name}'
Creating the Permanant Customer Sells Model /Done/
class Customer(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # Customer Name
    customer_name = models.ForeignKey(CustomerName,on_delete=models.CASCADE)
    # Customer Date Of Buying
    date_of_buying = models.DateField(auto_now=True)
    # Customer Supply Fk
    supply = models.ForeignKey(Supplies,on_delete=models.CASCADE,default="")
    # Supply Price
    price = models.IntegerField(default=0)
    # Supllys Countity
    countity = models.IntegerField(default=0)
    # Total Value: Countity x Price
    total = models.IntegerField(editable=False,default=0)
    # The Debt
    debt = models.IntegerField(default=0,null=True,blank=True)
    # paid
    paid = models.IntegerField(default=0,null=True,blank=True)
    # Notes
    notes = models.CharField(max_length=400,null=True,blank=True)
class Employee(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    employee_name = models.CharField(max_length=50,primary_key=True)
    date_of_employment = models.DateField()
    salary = models.IntegerField(default=0)
    next_salary = models.DateField()
#Creating the MoneyFund Model /Done/
class MoneyFund(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    permanant_fund = models.IntegerField(default=0)
    sells_fund = models.IntegerField(default=0)
#Creating the Sell Model /Done/
class Sell(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    supply = models.ForeignKey(Supplies,on_delete=models.CASCADE)
    # Countity
    countity = models.IntegerField()
    # Price
    price = models.IntegerField()
    # Total
    total = models.IntegerField(editable=False,default=0)
    # Date
    date = models.DateField(auto_now=True)
    # Notes
    notes = models.CharField(max_length=400,null=True,blank=True)
#Creating the Reciept (Supply Buying) Model /Done/
class Reciept(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # Type Fk
    type = models.ForeignKey(Type,on_delete=models.CASCADE)
    # Supply Fk
    supply = models.ForeignKey(Supplies,on_delete=models.CASCADE)
    # Countity
    countity = models.IntegerField()
    # Buy Price
    buy_price = models.IntegerField()
    # Sell Price
    sell_price = models.IntegerField()
    # Total Value: Buy Price x Countity
    total = models.IntegerField(editable=False,default=0)
    # Date
    date = models.DateField(auto_now=True)
    # Notes
    notes = models.CharField(max_length=400,null=True,blank=True)
#Creating the MoneyIncome Model  /Done/
class MoneyIncome(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # Money Comming from
    money_from = models.ForeignKey(CustomerName,on_delete=models.CASCADE,null=True,blank=True)
    # Total Value Incoming
    total = models.IntegerField()
    # Date
    date = models.DateField(auto_now=True)
    # notes
    notes = models.CharField(max_length=400,null=True,blank=True)
#Creating the MoneyIncome Model  /Done/
class Payment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    # Money Comming from
    money_for = models.CharField(max_length=250)
    # Total Value Incoming
    total = models.IntegerField()
    # Date
    date = models.DateField(auto_now=True)
    # notes
    notes = models.CharField(max_length=400,null=True,blank=True)
class Inventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    supply = models.ForeignKey('Supplies', on_delete=models.CASCADE)
    initial_countity = models.IntegerField(blank=True)
    final_countity = models.IntegerField(blank=True)
    initial_fund = models.IntegerField(blank=True)
    final_fund = models.IntegerField(blank=True)
    sales_countity = models.IntegerField(default=0, blank=True)
    purchase_countity = models.IntegerField(default=0, blank=True)
    debt_countity = models.IntegerField(default=0, blank=True)
    unpaid_customers = models.TextField(blank=True)
    discrepancy = models.IntegerField(default=0, blank=True)
    dispatched_supply = models.IntegerField(default=0, blank=True)
    dispatched_value = models.IntegerField(default=0, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    inventory_date = models.DateField(auto_now=True)
    notes = models.TextField(blank=True)
     