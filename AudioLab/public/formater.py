import google.generativeai as genai
import re
import pandas as pd
genai.configure(api_key="AIzaSyDgruawu1Pzyy0bCQAZC14eXP_fERrltzs")
def check_sustainability(each):
      
        #each = 'DUAL-SIDED NATURAL CLEANING POWER: The Vove Kitchen Sponges feature a powerful loofah scrubbing side and gentle wood pulp cellulose surface, perfect for tackling tough messes while protecting your delicate cookware. '
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"Analyse these lyrics and format them into versus,chorus,bridges,etc., and give the final output without any of your reasoning behind the formatting: {each}"
        response = model.generate_content(prompt)
        #print(f"Description: {each}")
        #match = re.search(r'Credibility Score -- (\d+)/5', str(response))
        print(response)
        '''if match != None :
            #print(f"Score: {match.group(1)}")
            return int(match.group(1))/5*100
        return 0'''
        return response

        #print(str(response)[1:-2])