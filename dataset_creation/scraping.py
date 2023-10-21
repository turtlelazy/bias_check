from bs4 import BeautifulSoup
import urllib.request
import json
from time import sleep
import csv
from random import randint

debug = False

domain_extensions = [".com",".net",".de",".cn",".uk",".org",".info",".nl",".eu",".ru"]

def load_us_domains(csv_file):
    filename = open(csv_file, 'r')
    csv_obj = csv.DictReader(filename)
    news_list = set()
    for row in csv_obj:
        news_list.add(row["domain"])
    return news_list


def parse_mbfc_category(link,file):
    html_doc = urllib.request.urlopen(link).read()
    soup = BeautifulSoup(html_doc, 'html.parser')
    table = soup.find(id="mbfc-table")
    table_rows = table.find_all("td")

    pairings = []

    for row in table_rows:
        #link = row.find('a',href=True)['href']
        #if link is not None:
        text = row.text
        if text:
            text = text.split()
            changed = False
            for word in text:
                if any(extension in word for extension in domain_extensions) :
                    word = word.replace("(","")
                    word = word.replace(")","")
                    text = word
                    changed = True
                    break
            if not changed:
                continue
            

        link = row.find('a',href=True)
        if link:
            link = link['href']
            pairings.append([text,link])
        
    items_list = json.dumps(pairings,indent=4)
    json_file = open(file,'w')
    json_file.write(items_list)
    json_file.close()

def scrape_website(url):
    html_doc = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html_doc, 'html.parser')

    #grab the Detailed Report category
    paragraph = soup.find_all("p")
    for para in paragraph:
        if "Bias Rating" in para.text:
            paragraph = para
            break

    #for data in paragraph(['style', 'script']):
        # Remove tags
        #data.decompose()
    #return ' '.join(paragraph.stripped_strings)


    lines = paragraph.text.split("\n")
    site_info = {}
    site_info["Report"] = {}
    for line in lines:
        index = line.find(":")
        if index == -1:
            continue
        header = line[:index].strip()
        content = line[index+1:].strip()
        site_info["Report"][header] = content

    # Grab the Analysis Section
    headers = soup.find_all("h4")
    for header in headers:
        if ("Analysis" in header.text) or ("Bias" in header.text):
            headers = header
            continue
    #print(headers)
    paragraph = headers.findNext("p")
    for match in paragraph.findAll('span'):
        match.unwrap()
    paragraph = paragraph.decode_contents()
    #print(paragraph)
    site_info["Analysis"] = paragraph
    return site_info

def accumulate_data(JSON_fileN, list_fileN):
    domains_set = load_us_domains("us-news-domains-v2.0.0.csv")
    j_file = open(JSON_fileN)
    l_file = open(list_fileN)

    json_data = json.load(j_file)
    list_data = json.load(l_file)
    
    for website in list_data:
        site = website[0]
        mbfc_site = website[1]
        if (site not in json_data) and (site in domains_set):
            if debug:
                print(site)
            try:
                json_data[site] = scrape_website(mbfc_site)
            except:
                print(f"Problem with site {mbfc_site}")

                # Save Progress
                aggr_data = json.dumps(json_data,indent=4)
                json_file = open(JSON_fileN,"w")
                json_file.write(aggr_data)
                json_file.close()
            sleep(randint(1,5) * 0.1)



    aggr_data = json.dumps(json_data,indent=4)
    json_file = open(JSON_fileN,"w")
    json_file.write(aggr_data)
    json_file.close()
    print(f"Finished data collection")


scrape_websites = ["center","left","leftcenter","right-center","right","conspiracy","fake-news","pro-science"]


# base_url = "https://mediabiasfactcheck.com/"



# for website in scrape_websites:
#     parse_url = base_url + website
#     parse_mbfc_category(parse_url,website + ".json")
#lines = scrape_website("https://mediabiasfactcheck.com/1news-new-zealand/")
#print(lines)

# string_to_test = "Bias Rating: LEFT-CENTER Factual Reporting: HIGH Country: New Zealand MBFC’s Country Freedom Rank: EXCELLENT Media Type: Website/TV Station Traffic/Popularity: High Traffic MBFC Credibility Rating: HIGH CREDIBILITY"

# def format_rating_report(inp_str):

#accumulate_data("aggregate_data.json","center.json")
# something = scrape_website("https://mediabiasfactcheck.com/2nd-amendment-daily-news/")
# print(json.dumps(something,indent=4))
# for site in load_us_domains("us-news-domains-v2.0.0.csv"):
#     print(site)
for label in scrape_websites:
    accumulate_data("aggregate_data.json",f"{label}.json")
