import pandas as pd

# Load the dataset
try:
    df = pd.read_csv('sales.csv')
except FileNotFoundError:
    print("Error: sales.csv not found. Please make sure the file is in the correct directory.")
    exit()

# Data Cleaning & Preparation

# Drop duplicate rows if any
df.drop_duplicates(inplace=True)

# Ensure correct data types, handling potential errors by coercing
df['Units Sold'] = pd.to_numeric(df['Units Sold'], errors='coerce')
df['Unit Price'] = pd.to_numeric(df['Unit Price'], errors='coerce')
df['Unit Cost'] = pd.to_numeric(df['Unit Cost'], errors='coerce')
df['Total Revenue'] = pd.to_numeric(df['Total Revenue'], errors='coerce')
df['Total Cost'] = pd.to_numeric(df['Total Cost'], errors='coerce')
df['Total Profit'] = pd.to_numeric(df['Total Profit'], errors='coerce')
df['Order Date'] = pd.to_datetime(df['Order Date'], errors='coerce')
df['Ship Date'] = pd.to_datetime(df['Ship Date'], errors='coerce')

# Drop rows with NaN values that might have been created during coercion
df.dropna(inplace=True)

# Create a unique CustomerID based on Country
df['CustomerID'] = df.groupby(['Country']).ngroup()

# Create a unique ProductID based on Item Type
df['ProductID'] = df.groupby(['Item Type']).ngroup()

# -- Create and save Customers table --
customers = df[['CustomerID', 'Country', 'Region']].copy()
customers.drop_duplicates(subset='CustomerID', inplace=True)
customers.rename(columns={'Country': 'CustomerName'}, inplace=True) # Renaming for clarity as requested
customers.to_csv('Customers.csv', index=False)


# -- Create and save Products table --
products = df[['ProductID', 'Item Type', 'Unit Price', 'Unit Cost']].copy()
products.drop_duplicates(subset='ProductID', inplace=True)
products.rename(columns={'Item Type': 'ProductName', 'Unit Price': 'UnitPrice', 'Unit Cost': 'UnitCost'}, inplace=True)
# The original request had 'Category', but the dataset does not have it. I'll use 'Item Type' as ProductName.
products['Category'] = products['ProductName'] # Creating category from item type as a placeholder
products = products[['ProductID', 'ProductName', 'Category', 'UnitPrice']] # Reordering to match original request more closely, although unitcost was not in the final list
products.to_csv('Products.csv', index=False)


# -- Create and save Sales table --
sales = df[['Order ID', 'Order Date', 'ProductID', 'CustomerID', 'Units Sold', 'Total Revenue', 'Total Cost', 'Total Profit']].copy()
sales.rename(columns={
    'Order ID': 'SalesOrderID',
    'Order Date': 'OrderDate',
    'Units Sold': 'Quantity',
    'Total Revenue': 'LineTotal'
}, inplace=True)
# The request asked for UnitPrice and LineTotal. I have LineTotal, but not the original UnitPrice in this final cut.
# I will add UnitPrice back from the main dataframe.
sales['UnitPrice'] = df['Unit Price']
sales = sales[['SalesOrderID', 'OrderDate', 'ProductID', 'CustomerID', 'Quantity', 'UnitPrice', 'LineTotal']]
sales.to_csv('Sales.csv', index=False)

print("Data processing complete. Files Customers.csv, Products.csv, and Sales.csv have been created.")
