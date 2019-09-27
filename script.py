import openpyxl


wb = openpyxl.load_workbook("Monthly Status Report.xlsx")

ws = wb.sheetnames

for(i in ws):
    