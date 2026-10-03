// City Pin — the city pool. One city per line:
//
//     name|country|latitude|longitude|tier
//
// tier 0 = "Famous" pool, 1 = also in "Tricky", 2 = only in "Brutal".
// Each pool includes every lower tier, so a tier-0 city appears in all three.
// Latitude is +north, longitude is +east, both in degrees.
//
// Edit freely: add a line, delete a line, rename a city, move one between tiers.
// Blank lines are ignored and a line starting with # is a comment, so you can
// group or annotate entries. Order does not matter (this list happens to run from
// the largest population down). The city counts shown on the start screen are
// derived from this file at load time, so they keep themselves honest.
//
// Derived from the GeoNames cities15000 dump, CC BY 4.0 — https://www.geonames.org/

window.CITYPIN_CITIES = `
Shanghai|China|31.22|121.46|0
Chongqing|China|29.56|106.56|0
Chengdu|China|30.67|104.07|0
Beijing|China|39.91|116.4|0
Guangzhou|China|23.12|113.25|0
Shenzhen|China|22.55|114.07|0
Kinshasa|Democratic Republic of the Congo|-4.33|15.31|0
Istanbul|Turkey|41.01|28.95|0
Lagos|Nigeria|6.45|3.39|0
Ho Chi Minh City|Vietnam|10.82|106.63|0
Tianjin|China|39.14|117.18|0
Wuhan|China|30.58|114.27|0
Lahore|Pakistan|31.56|74.35|0
Xi’an|China|34.26|108.93|0
Mumbai|India|19.07|72.88|0
Zhengzhou|China|34.76|113.65|0
São Paulo|Brazil|-23.55|-46.64|0
Mexico City|Mexico|19.43|-99.13|0
Hangzhou|China|30.29|120.16|0
Karachi|Pakistan|24.86|67.01|0
Shijiazhuang|China|38.04|114.48|0
Delhi|India|28.65|77.23|0
Moscow|Russia|55.75|37.62|0
Dhaka|Bangladesh|23.71|90.41|0
Seoul|South Korea|37.57|126.98|0
Harbin|China|45.75|126.65|0
Tokyo|Japan|35.69|139.69|0
Dongguan|China|23.02|113.75|0
Cairo|Egypt|30.06|31.25|0
Hefei|China|31.86|117.28|0
Johannesburg|South Africa|-26.2|28.04|0
Weifang|China|36.71|119.1|0
Nanjing|China|32.06|118.78|0
Jinan|China|36.67|117.0|0
Shenyang|China|41.79|123.43|0
Changchun|China|43.88|125.32|0
Foshan|China|23.03|113.13|0
London|United Kingdom|51.51|-0.13|0
New York City|United States|40.71|-74.01|0
Nanning|China|22.82|108.32|0
Jakarta|Indonesia|-6.21|106.85|0
Bengaluru|India|12.97|77.59|0
Kunming|China|25.04|102.72|0
Fuzhou|China|26.06|119.31|0
Hanoi|Vietnam|21.02|105.84|0
Taipei|Taiwan|25.05|121.53|0
Lima|Peru|-12.04|-77.03|0
Bogotá|Colombia|4.61|-74.08|0
Dalian|China|38.91|121.6|0
Hong Kong|Hong Kong|22.28|114.17|0
Baghdad|Iraq|33.34|44.4|0
Wuzhong|China|37.99|106.2|0
Qingdao|China|36.06|120.38|0
Tehran|Iran|35.69|51.42|0
Yantai|China|37.48|121.44|0
Hyderabad|India|17.38|78.46|0
Rio de Janeiro|Brazil|-22.91|-43.18|0
Suzhou|China|31.3|120.6|0
Ahmedabad|India|23.03|72.59|0
Abidjan|Ivory Coast|5.35|-4.0|0
Guiyang|China|26.58|106.72|0
Sydney|Australia|-33.87|151.21|0
Singapore|Singapore|1.29|103.85|0
Melbourne|Australia|-37.81|144.96|0
Dar es Salaam|Tanzania|-6.82|39.27|0
Saint Petersburg|Russia|59.94|30.31|0
Taiyuan|China|37.87|112.56|0
Alexandria|Egypt|31.2|29.92|0
Bangkok|Thailand|13.75|100.5|0
Kano|Nigeria|12.0|8.52|0
Santiago|Chile|-33.46|-70.65|0
Cape Town|South Africa|-33.93|18.42|0
Peshawar|Pakistan|34.01|71.58|0
Zibo|China|36.79|118.06|0
Jeddah|Saudi Arabia|21.49|39.19|0
Chennai|India|13.09|80.28|0
Kolkata|India|22.56|88.36|0
Xiamen|China|24.48|118.08|0
Surat|India|21.2|72.83|0
Yangzhou|China|32.4|119.44|0
Huai'an|China|33.59|119.02|0
Yangon|Myanmar|16.81|96.16|0
Bao'an|China|22.55|113.88|0
Kabul|Afghanistan|34.53|69.17|0
Nairobi|Kenya|-1.28|36.82|0
Wuxi|China|31.57|120.29|0
Giza|Egypt|30.01|31.21|0
Lanzhou|China|36.06|103.84|0
Bamako|Mali|12.61|-7.98|0
Riyadh|Saudi Arabia|24.69|46.72|0
Ürümqi|China|43.8|87.6|0
New Territories|Hong Kong|22.42|114.11|1
Chattogram|Bangladesh|22.34|91.83|0
Addis Ababa|Ethiopia|9.02|38.75|0
Zaozhuang|China|34.86|117.55|1
Zhongshan|China|22.52|113.38|1
Shantou|China|23.35|116.68|0
Los Angeles|United States|34.05|-118.24|0
Faisalabad|Pakistan|31.42|73.09|1
Dubai|United Arab Emirates|25.08|55.31|0
Yokohama|Japan|35.43|139.65|1
Ningbo|China|29.88|121.55|1
Casablanca|Morocco|33.59|-7.61|0
Ibadan|Nigeria|7.38|3.91|1
Puyang|China|29.46|119.89|1
Ankara|Turkey|39.92|32.85|0
Chengde|China|40.95|117.96|1
Shiyan|China|32.65|110.78|1
Hohhot|China|40.81|111.65|0
Berlin|Germany|52.52|13.41|0
Tangshan|China|39.64|118.18|0
Rawalpindi|Pakistan|33.6|73.05|0
Lüliang|China|37.52|111.14|1
Durban|South Africa|-29.86|31.03|0
Anshan|China|41.12|122.99|1
Changzhou|China|31.77|119.95|0
Busan|South Korea|35.1|129.03|0
Madrid|Spain|40.42|-3.7|0
Pyongyang|North Korea|39.03|125.75|0
Pune|India|18.52|73.86|0
Datong|China|40.09|113.29|1
Bursa|Turkey|40.2|29.06|0
Changsha|China|28.2|112.97|0
Quezon City|Philippines|14.65|121.05|1
Jaipur|India|26.92|75.79|0
Huainan|China|32.63|117.0|1
Surabaya|Indonesia|-7.25|112.75|1
Incheon|South Korea|37.46|126.71|0
Haikou|China|20.03|110.35|0
Caracas|Venezuela|10.49|-66.88|0
Kyiv|Ukraine|50.45|30.52|0
İzmir|Turkey|38.41|27.14|1
Huizhou|China|23.11|114.42|0
Buenos Aires|Argentina|-34.61|-58.38|0
Yinchuan|China|38.47|106.27|0
Taichung|Taiwan|24.15|120.68|1
Kanpur|India|26.47|80.35|1
Toronto|Canada|43.71|-79.4|0
Quito|Ecuador|-0.23|-78.52|0
Brisbane|Australia|-27.47|153.03|0
Luanda|Angola|-8.84|13.23|0
Baotou|China|40.65|109.84|0
Osaka|Japan|34.69|135.5|1
Linyi|China|35.06|118.34|1
Baoding|China|38.87|115.46|1
Kaohsiung|Taiwan|22.62|120.31|0
Brooklyn|United States|40.65|-73.95|1
Guayaquil|Ecuador|-2.2|-79.89|0
Belo Horizonte|Brazil|-19.92|-43.94|0
Minhang|China|31.11|121.37|1
Bazhong|China|31.87|106.74|1
Salvador|Brazil|-12.98|-38.49|0
Abuja|Nigeria|9.06|7.5|0
Gazipur|Bangladesh|24.0|90.42|1
Chicago|United States|41.85|-87.65|0
Wenzhou|China|28.0|120.67|0
Bekasi|Indonesia|-6.23|106.99|1
Dakar|Senegal|14.69|-17.44|0
Haiphong|Vietnam|20.86|106.68|1
Yunfu|China|22.93|112.04|1
Navi Mumbai|India|19.04|73.02|0
Mogadishu|Somalia|2.04|45.34|0
Kumasi|Ghana|6.69|-1.62|1
Bandung|Indonesia|-6.92|107.61|1
Gujranwala|Pakistan|32.16|74.19|1
Medan|Indonesia|3.58|98.67|1
Lucknow|India|26.84|80.92|0
Xining|China|36.63|101.76|0
Ouagadougou|Burkina Faso|12.37|-1.53|0
Nagpur|India|21.15|79.08|0
Fortaleza|Brazil|-3.72|-38.54|0
Cali|Colombia|3.43|-76.52|1
Tieling|China|42.29|123.84|1
Perth|Australia|-31.95|115.86|0
Daegu|South Korea|35.87|128.59|0
Algiers|Algeria|36.73|3.09|0
Nanchang|China|28.68|115.85|0
Baku|Azerbaijan|40.38|49.89|0
Nagoya|Japan|35.18|136.91|1
Rome|Italy|41.89|12.51|0
Queens|United States|40.68|-73.84|1
Houston|United States|29.76|-95.36|0
Mashhad|Iran|36.3|59.61|0
Shaoxing|China|30.0|120.58|1
Nantong|China|32.03|120.87|1
Baoshan|China|31.41|121.49|1
Gaziantep|Turkey|37.06|37.38|0
Lubumbashi|Democratic Republic of the Congo|-11.66|27.48|1
Manaus|Brazil|-3.1|-60.02|1
Lusaka|Zambia|-15.41|28.29|0
Brasília|Brazil|-15.78|-47.93|0
Zhuhai|China|22.28|113.57|0
Santo Domingo|Dominican Republic|18.47|-69.89|0
Dandong|China|40.13|124.39|0
Lomé|Togo|6.13|1.22|0
Multan|Pakistan|30.2|71.48|1
Havana|Cuba|23.13|-82.38|0
Depok|Indonesia|-6.4|106.82|1
Ordos|China|39.61|109.78|1
Paris|France|48.85|2.35|0
Coimbatore|India|11.01|76.97|0
Qingyang|China|35.71|107.64|1
Port Harcourt|Nigeria|4.78|7.01|1
Pretoria|South Africa|-25.74|28.19|0
Córdoba|Argentina|-31.41|-64.19|0
Mbuji-Mayi|Democratic Republic of the Congo|-6.14|23.59|1
Aleppo|Syria|36.2|37.16|0
Kunshan|China|31.38|120.95|1
Al Mawşil al Jadīdah|Iraq|36.33|43.11|1
Zunyi|China|27.69|106.91|0
La Paz|Bolivia|-16.5|-68.15|0
Lianyungang|China|34.6|119.22|1
Medellín|Colombia|6.25|-75.57|0
Puning|China|23.31|116.17|1
Indore|India|22.72|75.83|0
Tashkent|Uzbekistan|41.26|69.22|0
Ganzhou|China|25.85|114.93|0
Almaty|Kazakhstan|43.25|76.91|0
Khartoum|Sudan|15.55|32.53|0
Hamburg|Germany|53.55|9.99|0
Sapporo|Japan|43.07|141.35|0
Songjiang|China|31.03|121.22|1
Accra|Ghana|5.56|-0.2|0
Curitiba|Brazil|-25.43|-49.27|0
Sanaa|Yemen|15.35|44.21|0
Conakry|Guinea|9.54|-13.68|0
Tangerang|Indonesia|-6.18|106.63|1
Tijuana|Mexico|32.5|-117.0|1
Hyderabad|Pakistan|25.4|68.38|0
Beirut|Lebanon|33.89|35.5|0
Jieyang|China|23.54|116.37|1
Jilin|China|43.85|126.56|0
Jiading|China|31.39|121.24|1
Bucharest|Romania|44.43|26.11|0
Kakamega|Kenya|0.28|34.75|1
Shangqiu|China|34.41|115.66|1
Nanchong|China|30.8|106.08|1
Tainan|Taiwan|22.99|120.21|1
Kaduna|Nigeria|10.53|7.44|1
Davao|Philippines|7.07|125.61|1
Thāne|India|19.2|72.96|1
Diyarbakır|Turkey|37.91|40.22|0
Santa Cruz de la Sierra|Bolivia|-17.79|-63.18|1
Vadodara|India|22.3|73.21|0
Adana|Turkey|36.99|35.33|0
Siping|China|43.16|124.38|1
Nanyang|China|33.01|112.55|1
Abu Dhabi|United Arab Emirates|24.45|54.4|0
Palembang|Indonesia|-2.92|104.75|1
Sharjah|United Arab Emirates|25.33|55.41|0
Bhopal|India|23.25|77.4|0
Nanshan Residential|China|22.53|113.93|1
Jiangmen|China|22.58|113.08|0
Benin City|Nigeria|6.34|5.63|0
Jiangyin|China|31.91|120.26|1
Fuyang|China|32.9|115.82|1
Montréal|Canada|45.51|-73.59|0
Bayan Nur|China|40.74|107.39|1
Maracaibo|Venezuela|10.64|-71.61|1
Chaozhou|China|23.65|116.62|0
Minsk|Belarus|53.9|27.57|0
Budapest|Hungary|47.5|19.04|0
Qingyuan|China|23.7|113.03|1
Tai’an|China|36.19|117.12|1
Rasapūdipalem|India|17.73|83.32|1
Pimpri-Chinchwad|India|18.62|73.8|1
Caloocan|Philippines|14.65|120.97|1
Warsaw|Poland|52.23|21.01|0
Soweto|South Africa|-26.27|27.86|0
Semarang|Indonesia|-6.99|110.42|1
Puebla|Mexico|19.05|-98.21|0
Vienna|Austria|48.21|16.37|0
Barcelona|Spain|41.39|2.16|0
Patna|India|25.59|85.14|0
Kallakurichi|India|11.73|78.96|1
Kampala|Uganda|0.32|32.58|0
Changshu|China|31.65|120.74|1
Rabat|Morocco|34.01|-6.83|0
Recife|Brazil|-8.05|-34.88|0
Phoenix|United States|33.45|-112.07|0
Ecatepec de Morelos|Mexico|19.6|-99.06|1
Lu’an|China|31.74|116.52|1
Valencia|Venezuela|10.16|-68.0|0
Ludhiana|India|30.91|75.85|1
Yancheng|China|33.36|120.16|1
Novosibirsk|Russia|55.02|82.93|0
Erbil|Iraq|36.19|44.01|0
Fukuoka|Japan|33.6|130.42|1
Taizhou|China|32.49|119.91|0
Daqing|China|46.58|125.0|0
Wuhu|China|31.35|118.43|1
Santiago de Querétaro|Mexico|20.59|-100.39|0
Dazhou|China|31.21|107.46|1
León de los Aldama|Mexico|21.12|-101.68|1
Makkah|Saudi Arabia|21.43|39.83|0
Philadelphia|United States|39.95|-75.16|0
Phnom Penh|Cambodia|11.56|104.92|0
Guilin|China|25.28|110.3|1
Damascus|Syria|33.51|36.29|0
Quetta|Pakistan|30.18|67.0|0
Zhaoqing|China|23.05|112.46|0
Onitsha|Nigeria|6.15|6.79|1
Mianyang|China|31.47|104.68|1
Auckland|New Zealand|-36.85|174.76|0
Isfahan|Iran|32.65|51.67|0
Wanzhou|China|30.76|108.4|1
Astana|Kazakhstan|51.18|71.45|0
Harare|Zimbabwe|-17.83|31.05|0
Monrovia|Liberia|6.3|-10.8|0
Putian|China|25.44|119.01|1
Kawasaki|Japan|35.52|139.72|1
Goiânia|Brazil|-16.68|-49.25|0
San Antonio|United States|29.42|-98.49|0
Kobe|Japan|34.69|135.18|0
Jinzhou|China|41.11|121.14|0
Stockholm|Sweden|59.33|18.07|0
Ciudad Juárez|Mexico|31.72|-106.46|0
Cần Thơ|Vietnam|10.04|105.79|1
Munich|Germany|48.14|11.58|0
Khulna|Bangladesh|22.81|89.56|1
Belém|Brazil|-1.46|-48.5|0
Yekaterinburg|Russia|56.86|60.62|0
Porto Alegre|Brazil|-30.03|-51.23|0
Manhattan|United States|40.78|-73.97|1
Nashik|India|20.0|73.79|1
Asunción|Paraguay|-25.29|-57.65|0
Yiwu|China|29.32|120.08|1
Zapopan|Mexico|20.72|-103.39|1
Makassar|Indonesia|-5.15|119.43|1
Adelaide|Australia|-34.93|138.6|0
Quanzhou|China|24.91|118.59|0
Madurai|India|9.92|78.12|0
Jinhua|China|29.11|119.64|1
Kyoto|Japan|35.02|135.75|0
Cixi|China|30.18|121.25|1
Changde|China|29.03|111.7|0
Kuala Lumpur|Malaysia|3.14|101.69|0
Kayseri|Turkey|38.73|35.49|0
Kaifeng|China|34.8|114.31|0
Karaj|Iran|35.83|50.99|0
Kathmandu|Nepal|27.7|85.32|0
Daejeon|South Korea|36.35|127.38|1
Baoji|China|34.37|107.24|1
Suqian|China|33.95|118.3|1
Liuzhou|China|24.32|109.41|1
Tirunelveli|India|8.73|77.68|1
Konya|Turkey|37.87|32.48|0
Zhangjiagang|China|31.86|120.54|1
Agra|India|27.18|78.02|1
South Tangerang|Indonesia|-6.29|106.72|1
Tabriz|Iran|38.08|46.29|0
Kharkiv|Ukraine|49.98|36.25|0
Xinyang|China|32.12|114.07|1
Jinjiang|China|24.82|118.57|1
Faridabad|India|28.41|77.31|1
Bozhou|China|33.88|115.77|1
Qujing|China|25.48|103.78|1
San Diego|United States|32.72|-117.16|0
Gwangju|South Korea|35.15|126.92|0
Zhanjiang|China|21.23|110.39|1
Fushun|China|41.89|123.94|1
Rājkot|India|22.29|70.79|1
Luoyang|China|34.67|112.44|0
Guadalajara|Mexico|20.68|-103.35|0
The Bronx|United States|40.85|-73.87|1
Guankou|China|28.16|113.63|1
Huế|Vietnam|16.46|107.6|0
Milan|Italy|45.46|9.19|0
Najafgarh|India|28.61|76.98|1
Lianjiang|China|21.65|110.28|1
N'Djamena|Chad|12.11|15.04|0
Handan|China|36.61|114.49|1
Bannu|Pakistan|32.99|70.6|1
Yichang|China|30.71|111.28|1
Antananarivo|Madagascar|-18.91|47.54|0
Heze|China|35.24|115.47|1
Guarulhos|Brazil|-23.46|-46.53|1
Jamshedpur|India|22.8|86.19|0
Douala|Cameroon|4.05|9.7|1
Antalya|Turkey|36.91|30.7|0
Gaozhou|China|21.92|110.86|1
Basrah|Iraq|30.51|47.78|1
Dallas|United States|32.78|-96.81|0
Benxi|China|41.29|123.77|0
Saitama|Japan|35.91|139.66|1
Niamey|Niger|13.51|2.11|0
Liupanshui|China|26.59|104.83|1
Taguig|Philippines|14.52|121.08|1
Maoming|China|21.67|110.91|1
Calgary|Canada|51.05|-114.09|0
Tripoli|Libya|32.89|13.19|0
Madinah|Saudi Arabia|24.47|39.61|0
Yaoundé|Cameroon|3.87|11.52|0
Batam|Indonesia|1.15|104.02|1
Qinzhou|China|21.98|108.65|0
Luohe|China|33.57|114.03|1
Xiangyang|China|32.04|112.14|0
Yangjiang|China|21.86|111.96|1
Huazhou|China|21.63|110.58|1
Yixing|China|31.36|119.82|1
Da Nang|Vietnam|16.07|108.22|1
Amman|Jordan|31.96|35.95|0
Budta|Philippines|7.2|124.44|1
Belgrade|Serbia|44.8|20.47|0
Biên Hòa|Vietnam|10.94|106.82|1
Qingpu|China|31.15|121.11|1
Montevideo|Uruguay|-34.9|-56.19|0
Xiantao|China|30.37|113.44|1
Xuchang|China|34.03|113.86|1
Kalyān|India|19.24|73.14|1
Zigong|China|29.34|104.78|1
Nizhniy Novgorod|Russia|56.33|44.0|0
Jepara|Indonesia|-6.59|110.67|1
Maputo|Mozambique|-25.97|32.58|0
Xuzhou|China|34.2|117.28|1
Dammam|Saudi Arabia|26.43|50.1|0
Neijiang|China|29.58|105.06|1
Shiraz|Iran|29.61|52.53|0
Heshan|China|28.57|112.35|1
Kananga|Democratic Republic of the Congo|-5.9|22.42|1
Hechuan|China|29.99|106.26|1
Kazan|Russia|55.79|49.12|0
Jining|China|35.41|116.58|0
Barquisimeto|Venezuela|10.06|-69.36|1
Shubrā al Khaymah|Egypt|30.13|31.25|1
Putuo|China|31.25|121.39|1
Port-au-Prince|Haiti|18.54|-72.34|0
Suwon|South Korea|37.29|127.01|1
Liaocheng|China|36.45|116.0|1
Jinzhong|China|37.68|112.75|1
Callao|Peru|-12.05|-77.13|0
Meerut|India|28.98|77.71|1
Virār|India|19.46|72.81|1
Nowrangapur|India|19.23|82.55|1
Karbala|Iraq|32.62|44.02|0
Changzhi|China|36.18|113.11|0
Tianshui|China|34.58|105.74|1
Sadr City|Iraq|33.39|44.46|1
Yangpu|China|31.26|121.52|1
Mombasa|Kenya|-4.05|39.66|1
Mandalay|Myanmar|21.97|96.08|1
Srinagar|India|34.09|74.81|0
Barranquilla|Colombia|10.97|-74.78|0
Chelyabinsk|Russia|55.16|61.43|0
Mérida|Mexico|20.97|-89.62|1
Hiroshima|Japan|34.4|132.45|0
Santiago de los Caballeros|Dominican Republic|19.45|-70.69|1
Shymkent|Kazakhstan|42.31|69.6|0
Weinan|China|34.5|109.51|1
Ghāziābād|India|28.67|77.44|0
Matola|Mozambique|-25.96|32.46|1
Dhanbad|India|23.8|86.43|1
Arequipa|Peru|-16.4|-71.54|1
Fes|Morocco|34.03|-5.0|1
Gustavo Adolfo Madero|Mexico|19.49|-99.11|1
Nouakchott|Mauritania|18.09|-15.98|0
Kisangani|Democratic Republic of the Congo|0.52|25.19|1
Jiaxing|China|30.75|120.75|1
Aurangabad|India|19.88|75.34|1
Zhongwei|China|37.51|105.19|1
Omsk|Russia|54.99|73.37|0
Pikine|Senegal|14.76|-17.39|1
Pekanbaru|Indonesia|0.52|101.44|1
Panjin|China|41.12|122.07|1
Bandar Lampung|Indonesia|-5.43|105.26|1
Prague|Czechia|50.09|14.42|0
Varanasi|India|25.32|83.01|0
Jiujiang|China|29.7|116.0|1
Samara|Russia|53.21|50.14|0
Aba|Nigeria|5.11|7.37|1
Amritsar|India|31.62|74.88|0
Birmingham|United Kingdom|52.48|-1.9|0
Zoucheng|China|35.4|116.97|1
Copenhagen|Denmark|55.68|12.57|0
Sofia|Bulgaria|42.7|23.32|0
Anyang|China|36.1|114.38|1
Yerevan|Armenia|40.18|44.51|0
Vijayawada|India|16.51|80.65|0
Fengxiang|China|30.86|121.47|1
Bijie|China|27.3|105.29|1
Monterrey|Mexico|25.68|-100.32|0
Kigali|Rwanda|-1.95|30.06|0
Rostov-on-Don|Russia|47.22|39.71|0
Zhuzhou|China|27.83|113.15|0
Rui’an|China|27.78|120.66|1
Malingao|Philippines|7.16|124.47|1
Touba|Senegal|14.86|-15.88|1
Ufa|Russia|54.74|55.97|1
Ranchi|India|23.34|85.31|0
Shangrao|China|28.45|117.94|1
Lilongwe|Malawi|-13.97|33.79|0
Huaibei|China|33.97|116.79|1
Maiduguri|Nigeria|11.85|13.16|1
Xuhui|China|31.2|121.45|1
Meishan|China|30.04|103.84|1
Mwanza|Tanzania|-2.52|32.9|1
Shouguang|China|36.88|118.74|1
Wuchang|China|30.54|114.3|1
Ulsan|South Korea|35.54|129.32|1
Sendai|Japan|38.27|140.87|1
Krasnoyarsk|Russia|56.04|92.93|1
Guigang|China|23.12|109.59|1
Oslo|Norway|59.91|10.75|0
Jabalpur|India|23.17|79.95|1
Ilorin|Nigeria|8.5|4.54|1
Aden|Yemen|12.78|45.04|0
Bogor|Indonesia|-6.59|106.79|1
Ciudad Nezahualcoyotl|Mexico|19.4|-99.01|1
Hengyang|China|26.89|112.62|0
Prayagraj|India|25.44|81.84|1
Gongzhuling|China|43.5|124.82|1
Trujillo|Peru|-8.12|-79.03|0
Visakhapatnam|India|17.68|83.2|0
Goyang-si|South Korea|37.66|126.83|1
Yulin|China|22.63|110.15|1
Jodhpur|India|26.27|73.01|0
Gwalior|India|26.23|78.17|1
Jingzhou|China|30.35|112.19|1
Gqeberha|South Africa|-33.96|25.61|0
Tbilisi|Georgia|41.69|44.83|0
Voronezh|Russia|51.67|39.19|1
Xinxiang|China|35.19|113.8|1
Yichun|China|27.83|114.4|1
Sokoto|Nigeria|13.06|5.24|1
Jos|Nigeria|9.93|8.89|1
Tangier|Morocco|35.77|-5.8|1
Teni|India|10.01|77.48|1
Xianyang|China|34.34|108.7|1
Mexicali|Mexico|32.63|-115.45|1
Pointe-Noire|Republic of the Congo|-4.78|11.86|1
Maceió|Brazil|-9.67|-35.74|0
Campinas|Brazil|-22.91|-47.06|1
Sanya|China|18.25|109.51|1
Rangpur|Bangladesh|25.75|89.25|1
Kirkuk|Iraq|35.47|44.39|0
Ashgabat|Turkmenistan|37.95|58.38|0
Shaoguan|China|24.8|113.58|0
Howrah|India|22.58|88.32|1
Raipur|India|21.23|81.63|0
Changwon|South Korea|35.23|128.68|0
Longyan|China|25.07|117.02|1
Köln|Germany|50.93|6.95|0
Dublin|Ireland|53.33|-6.25|0
Tiruchirappalli|India|10.82|78.7|0
Yongzhou|China|26.42|111.61|1
Brussels|Belgium|50.85|4.35|0
Zamboanga|Philippines|6.91|122.07|1
Ottawa|Canada|45.41|-75.7|0
Huzhou|China|30.87|120.09|1
Xinyi|China|22.37|110.95|1
Volgograd|Russia|48.71|44.5|0
Edmonton|Canada|53.55|-113.47|0
Odesa|Ukraine|46.49|30.74|0
Wuwei|China|37.93|102.63|1
Jacksonville|United States|30.33|-81.66|0
Fort Worth|United States|32.73|-97.32|0
Yishui|China|35.78|118.63|1
Hanzhong|China|33.08|107.02|1
Hezhou|China|24.4|111.57|1
Pest|Hungary|47.5|19.08|1
Kota|India|25.18|75.84|1
Zhu Cheng City|China|36.0|119.4|1
Dongying|China|37.46|118.49|2
Luzhou|China|28.89|105.43|2
San Jose|United States|37.34|-121.89|0
Sholapur|India|17.67|75.91|2
Marrakesh|Morocco|31.63|-8.0|2
Guatemala City|Guatemala|14.64|-90.51|0
Meizhou|China|24.29|116.12|2
Yueyang|China|29.37|113.09|2
Laiwu|China|36.19|117.66|2
Esenyurt|Turkey|41.03|28.68|2
Perm|Russia|58.01|56.25|0
Zaria|Nigeria|11.11|7.72|2
Chiba|Japan|35.6|140.12|2
Pingdingshan|China|33.73|113.32|2
Ciudad Guayana|Venezuela|8.35|-62.64|2
Sargodha|Pakistan|32.09|72.67|2
Austin|United States|30.27|-97.74|0
Managua|Nicaragua|12.13|-86.25|0
Bengbu|China|32.94|117.36|2
Salé|Morocco|34.05|-6.8|2
Jerusalem|Israel|31.77|35.22|0
Chandigarh|India|30.74|76.79|2
Dnipro|Ukraine|48.47|35.04|0
Feicheng|China|36.25|116.77|2
Cebu City|Philippines|10.32|123.89|0
Sanhe|China|39.98|117.07|2
Guli|China|28.88|120.03|2
Qingzhou|China|36.7|118.48|2
Tiruppur|India|11.12|77.35|2
Guwahati|India|26.18|91.75|0
Anqiu|China|36.43|119.19|2
Xiangtan|China|27.85|112.9|2
Linfen|China|36.09|111.52|2
Victoria|Hong Kong|22.29|114.14|2
Zhenjiang|China|32.21|119.46|2
Enugu|Nigeria|6.44|7.5|2
Rosario|Argentina|-32.95|-60.64|2
Xiangxiang|China|27.73|112.53|2
Huludao|China|40.75|120.84|2
Hubballi|India|15.35|75.13|2
Padang|Indonesia|-0.95|100.35|2
Kitakyushu|Japan|33.85|130.85|2
Taiz|Yemen|13.58|44.02|2
Setagaya|Japan|35.64|139.65|2
Kingston|Jamaica|18.0|-76.79|0
Chihuahua|Mexico|28.64|-106.09|0
Nay Pyi Taw|Myanmar|19.75|96.13|0
Eskişehir|Turkey|39.78|30.52|0
Mysuru|India|12.3|76.64|0
Salem|India|11.65|78.16|2
São Luís|Brazil|-2.53|-44.3|0
Seongnam-si|South Korea|37.44|127.14|2
Cartagena|Colombia|10.4|-75.49|0
Columbus|United States|39.96|-83.0|0
Sialkot|Pakistan|32.49|74.53|2
Charlotte|United States|35.23|-80.84|0
Laibin|China|23.75|109.22|2
Warri|Nigeria|5.52|5.75|2
Naples|Italy|40.85|14.27|0
Xiaogan|China|30.93|113.92|2
Wuchuan|China|21.46|110.77|2
Campo Grande|Brazil|-20.44|-54.65|0
Ziyang|China|30.12|104.65|2
Bobo-Dioulasso|Burkina Faso|11.18|-4.29|2
Bahawalpur|Pakistan|29.4|71.68|2
Quzhou|China|28.96|118.87|2
Blantyre|Malawi|-15.78|35.01|2
Donetsk|Ukraine|48.02|37.8|0
Abū Ghurayb|Iraq|33.31|44.18|2
Qom|Iran|34.64|50.88|2
Bishkek|Kyrgyzstan|42.87|74.59|0
Krasnodar|Russia|45.05|38.98|2
Natal|Brazil|-5.79|-35.21|2
Macheng|China|31.18|115.02|2
Pingxiang|China|27.62|113.85|0
Malang|Indonesia|-7.98|112.63|2
Cancún|Mexico|21.17|-86.85|2
Zaoyang|China|32.13|112.75|2
Indianapolis|United States|39.77|-86.16|0
Gurugram|India|28.46|77.03|0
Bhubaneswar|India|20.27|85.83|2
Zhoushan|China|29.99|122.2|2
Qiqihar|China|47.34|123.96|0
Mulenvos|Angola|-8.87|13.33|2
Sulaymaniyah|Iraq|35.56|45.43|0
Marseille|France|43.3|5.38|0
Bhiwandi|India|19.3|73.06|2
Soshanguve|South Africa|-25.47|28.1|2
Laiyang|China|36.98|120.71|2
Daye|China|30.08|114.95|2
Teresina|Brazil|-5.09|-42.8|2
Ankang|China|32.68|109.02|2
Jalandhar|India|31.33|75.58|0
Zhongxiang|China|31.17|112.58|2
Rotterdam|The Netherlands|51.92|4.48|0
Langfang|China|39.52|116.71|2
Lhasa|China|29.65|91.1|0
Duque de Caxias|Brazil|-22.79|-43.31|2
Viana|Angola|-8.91|13.37|2
Jiaozuo|China|35.24|113.24|2
Samarinda|Indonesia|-0.49|117.15|2
Rohini|India|28.74|77.07|2
Guang’an|China|30.47|106.64|2
Johor Bahru|Malaysia|1.47|103.76|0
Arifwala|Pakistan|30.29|73.07|2
Cheongju-si|South Korea|36.64|127.49|2
Kanayannur|India|9.97|76.27|2
Tegucigalpa|Honduras|14.08|-87.21|0
Bucheon-si|South Korea|37.5|126.78|2
Thanh Hóa|Vietnam|19.8|105.77|0
Turin|Italy|45.07|7.69|0
Al Ain City|United Arab Emirates|24.19|55.76|2
Libreville|Gabon|0.39|9.45|0
Saratov|Russia|51.54|45.99|0
Ulan Bator|Mongolia|47.91|106.88|0
Weihai|China|37.51|122.11|2
Takeo|Cambodia|10.99|104.78|2
Nova Iguaçu|Brazil|-22.76|-43.45|2
Cochabamba|Bolivia|-17.38|-66.16|2
Ahvaz|Iran|31.32|48.68|0
Vientiane|Laos|17.97|102.6|0
São Bernardo do Campo|Brazil|-23.69|-46.56|2
Shangyu|China|30.02|120.87|2
Xinyu|China|27.8|114.93|2
Pietermaritzburg|South Africa|-29.62|30.39|0
Yibin|China|28.76|104.64|0
Naucalpan de Juárez|Mexico|19.48|-99.24|2
Jieshou|China|33.26|115.36|2
Kampung Baru Subang|Malaysia|3.15|101.53|2
Bouaké|Ivory Coast|7.69|-5.03|2
Taicang|China|31.45|121.09|2
San Francisco|United States|37.77|-122.42|0
Sakai|Japan|34.58|135.47|2
Jiaojiang|China|28.7|121.47|2
Valencia|Spain|39.47|-0.38|0
Jinshan|China|30.84|121.29|2
Chenzhou|China|25.8|113.03|2
João Pessoa|Brazil|-7.12|-34.86|0
Bukavu|Democratic Republic of the Congo|-2.49|28.84|2
Kraków|Poland|50.06|19.94|0
Barcelona|Venezuela|10.14|-64.69|2
Bangui|Central African Republic|4.36|18.55|0
Hermosillo|Mexico|29.09|-110.97|0
Bhayandar|India|19.3|72.85|2
Culiacán|Mexico|24.8|-107.39|2
Petaling Jaya|Malaysia|3.11|101.61|2
Anqing|China|30.51|117.05|0
Oran|Algeria|35.7|-0.64|0
Sanshui|China|23.15|112.89|2
Freetown|Sierra Leone|8.49|-13.24|0
San Pedro Sula|Honduras|15.51|-88.03|2
Narela|India|28.85|77.09|2
Xingtai|China|37.06|114.49|0
Niigata|Japan|37.92|139.04|2
Muscat|Oman|23.58|58.41|0
Zarqa|Jordan|32.07|36.09|2
Küçükçekmece|Turkey|40.99|28.77|2
Hamamatsu|Japan|34.7|137.73|2
Kolwezi|Democratic Republic of the Congo|-10.71|25.47|2
Vinh|Vietnam|18.67|105.69|2
Thiruvananthapuram|India|8.49|76.95|0
Zhaotong|China|27.32|103.72|2
Hondlon|China|40.65|109.79|2
Panzhihua|China|26.59|101.71|2
Chuzhou|China|32.32|118.3|2
Seattle|United States|47.61|-122.33|0
Port Said|Egypt|31.27|32.3|2
Cúcuta|Colombia|7.91|-72.5|2
Homs|Syria|34.72|36.73|0
Xuancheng|China|30.95|118.76|2
Ibb|Yemen|13.97|44.18|2
Tasikmalaya|Indonesia|-7.33|108.22|2
Nampula|Mozambique|-15.12|39.27|2
Bujumbura|Burundi|-3.38|29.36|0
Tyumen|Russia|57.15|65.53|0
Erzurum|Turkey|39.91|41.28|0
Anshun|China|26.25|105.93|2
Dodoma|Tanzania|-6.17|35.74|0
Rajshahi|Bangladesh|24.37|88.6|2
Dera Ismail Khan|Pakistan|31.83|70.9|2
Sorocaba|Brazil|-23.5|-47.46|2
Wuzhou|China|23.48|111.29|2
Ipoh|Malaysia|4.58|101.08|2
Qinhuangdao|China|39.94|119.59|0
Benghazi|Libya|32.11|20.07|0
Uberlândia|Brazil|-18.92|-48.28|2
Alīgarh|India|27.88|78.07|2
Shaoyang|China|27.24|111.46|0
Malatya|Turkey|38.35|38.32|2
Winnipeg|Canada|49.88|-97.15|0
Ōta|Japan|35.56|139.72|2
Andijon|Uzbekistan|40.78|72.35|2
Bareilly|India|28.37|79.43|2
Buraydah|Saudi Arabia|26.33|43.97|2
Hegang|China|47.35|130.29|0
Morelia|Mexico|19.7|-101.18|2
Riga|Latvia|56.95|24.11|0
Zhuanghe|China|39.7|122.99|2
Amsterdam|The Netherlands|52.37|4.89|0
Cagayan de Oro|Philippines|8.48|124.65|2
Ma’anshan|China|31.69|118.51|2
Pulandian|China|39.4|121.97|2
Shizuishan|China|38.98|106.39|2
Kumamoto|Japan|32.81|130.69|2
Oyo|Nigeria|7.85|3.93|2
Serang|Indonesia|-6.12|106.15|2
Torreón|Mexico|25.54|-103.42|2
Deyang|China|31.13|104.38|2
Abeokuta|Nigeria|7.16|3.35|2
Al Ḩudaydah|Yemen|14.8|42.95|2
Yangquan|China|37.86|113.56|2
Akure|Nigeria|7.25|5.19|2
Denver|United States|39.74|-104.98|0
Osasco|Brazil|-23.53|-46.79|2
Kikolo|Angola|-8.78|13.33|2
Chaohu|China|31.6|117.87|2
São José dos Campos|Brazil|-23.18|-45.89|2
Álvaro Obregón|Mexico|19.36|-99.2|2
Aihara|Japan|35.6|139.32|2
Evaton|South Africa|-26.53|27.85|2
Valenzuela|Philippines|14.7|120.97|2
Muzaffarābād|Pakistan|34.37|73.47|2
Okayama|Japan|34.65|133.93|2
San Luis Potosí|Mexico|22.15|-100.97|2
Aguascalientes|Mexico|21.88|-102.28|0
General Santos|Philippines|6.11|125.17|2
Zhumadian|China|32.98|114.03|2
Morādābād|India|28.84|78.78|2
Sagamihara|Japan|35.57|139.24|2
Qingshan|China|40.66|109.88|2
Mississauga|Canada|43.58|-79.66|2
Lviv|Ukraine|49.84|24.02|0
Namangan|Uzbekistan|41.0|71.67|2
Zaporizhzhya|Ukraine|47.85|35.12|0
Zanzibar|Tanzania|-6.16|39.2|0
Saltillo|Mexico|25.43|-100.98|2
Latakia|Syria|35.53|35.79|0
Subang Jaya|Malaysia|3.04|101.58|2
Warangal|India|18.0|79.58|2
Paranaque City|Philippines|14.48|121.02|2
Tolyatti|Russia|53.53|49.35|2
Santo Domingo Oeste|Dominican Republic|18.5|-70.0|2
Santo Domingo Este|Dominican Republic|18.49|-69.85|2
Battagram|Pakistan|34.68|73.02|2
Suez|Egypt|29.97|32.53|0
Ribeirão Preto|Brazil|-21.18|-47.81|2
Agadir|Morocco|30.42|-9.6|0
Edogawe|Japan|35.69|139.87|2
Sarajevo|Bosnia and Herzegovina|43.85|18.36|0
Balikpapan|Indonesia|-1.27|116.83|2
Adachi|Japan|35.76|139.81|2
Bauchi|Nigeria|10.31|9.84|2
Shizuoka|Japan|34.98|138.38|0
Tunis|Tunisia|36.82|10.17|0
Zhangjiakou|China|40.78|114.87|0
Washington|United States|38.9|-77.04|0
Nashville|United States|36.17|-86.78|0
Fuxin|China|42.02|121.66|2
Ta’if|Saudi Arabia|21.27|40.42|0
Huangshi|China|30.25|115.05|0
Liaoyang|China|41.27|123.17|2
Hlaingthaya|Myanmar|16.85|96.07|2
Beira|Mozambique|-19.84|34.84|2
Zaragoza|Spain|41.66|-0.88|0
Sevilla|Spain|37.38|-5.97|0
Baise|China|23.89|106.63|2
Pontianak|Indonesia|-0.03|109.33|2
Situbondo|Indonesia|-7.71|114.01|2
Agege|Nigeria|6.62|3.33|2
Binzhou|China|37.37|118.02|2
Oklahoma City|United States|35.47|-97.52|0
Yuncheng|China|35.02|110.99|2
Dezhou|China|37.45|116.37|2
Dushanbe|Tajikistan|38.54|68.78|0
Cotonou|Benin|6.37|2.42|2
El Paso|United States|31.76|-106.49|2
Gorakhpur|India|26.77|83.37|0
Hami|China|42.83|93.51|2
Wrocław|Poland|51.1|17.03|0
Denpasar|Indonesia|-8.65|115.22|2
Guntur|India|16.3|80.46|0
Katsina|Nigeria|12.99|7.6|2
Sanmenxia|China|34.78|111.19|2
E’zhou|China|30.4|114.89|2
Tabuk|Saudi Arabia|28.4|36.57|2
Kitwe|Zambia|-12.8|28.21|2
Bulawayo|Zimbabwe|-20.15|28.58|2
Mudanjiang|China|44.55|129.63|2
Aracaju|Brazil|-10.91|-37.07|2
Joinville|Brazil|-26.3|-48.85|2
Athens|Greece|37.98|23.73|0
Zagreb|Croatia|45.81|15.98|0
Leshan|China|29.56|103.76|2
Santo André|Brazil|-23.66|-46.54|2
Vancouver|Canada|49.25|-123.12|0
Rizhao|China|35.41|119.53|2
Helsinki|Finland|60.17|24.94|0
Cheonan|South Korea|36.81|127.15|2
Acapulco de Juárez|Mexico|16.85|-99.91|2
Dongcun|China|36.78|121.16|2
Banjarmasin|Indonesia|-3.32|114.59|2
Puducherry|India|11.93|79.83|2
Suining|China|30.51|105.57|2
Brampton|Canada|43.68|-79.77|2
Soacha|Colombia|4.58|-74.22|2
Boston|United States|42.36|-71.06|0
Jājmau|India|26.43|80.41|2
Portland|United States|45.52|-122.68|0
Calumbo|Angola|-9.15|13.42|2
Tlaquepaque|Mexico|20.64|-103.29|2
Frankfurt am Main|Germany|50.12|8.68|0
Macau|Macao|22.2|113.55|0
Palermo|Italy|38.12|13.36|2
Izhevsk|Russia|56.85|53.2|0
Colombo|Sri Lanka|6.94|79.85|0
Maturín|Venezuela|9.75|-63.18|2
Amravati|India|20.93|77.75|2
Lingyuan|China|41.24|119.4|2
Detroit|United States|42.33|-83.05|0
Mingguang|China|32.78|117.96|2
Osogbo|Nigeria|7.77|4.56|2
Honchō|Japan|35.7|139.99|2
Bikaner|India|28.02|73.31|2
Jaboatão dos Guararapes|Brazil|-8.11|-35.01|2
Las Vegas|United States|36.17|-115.14|0
New South Memphis|United States|35.09|-90.06|2
Hwaseong-si|South Korea|37.21|126.82|2
Gold Coast|Australia|-28.0|153.43|2
Łódź|Poland|51.77|19.47|0
Jeonju|South Korea|35.82|127.15|0
Chongming|China|31.62|121.7|2
Al Aḩmadī|Kuwait|29.08|48.08|2
Cuenca|Ecuador|-2.9|-79.0|2
Chisinau|Moldova|47.01|28.86|0
Likasi|Democratic Republic of the Congo|-10.98|26.74|2
Jambi City|Indonesia|-1.6|103.62|2
Hebi|China|35.73|114.29|2
Comilla|Bangladesh|23.46|91.19|2
Tshikapa|Democratic Republic of the Congo|-6.42|20.8|2
Chunian|Pakistan|30.97|73.98|2
Kochi|India|9.94|76.26|2
Memphis|United States|35.15|-90.05|2
Jingmen|China|31.03|112.2|2
Barnaul|Russia|53.36|83.73|2
Piura|Peru|-5.18|-80.66|2
Bhilai|India|21.21|81.43|2
Ndola|Zambia|-12.96|28.64|2
Contagem|Brazil|-19.93|-44.05|2
Ulyanovsk|Russia|54.33|48.39|0
Djibouti|Djibouti|11.59|43.15|0
Glasgow|United Kingdom|55.87|-4.26|0
Panshan|China|41.19|122.05|2
Louisville|United States|38.25|-85.76|0
Irkutsk|Russia|52.3|104.29|0
Ansan-si|South Korea|37.32|126.82|2
Al Mansurah|Egypt|31.04|31.38|2
Kermanshah|Iran|34.31|47.06|2
Jiaozhou|China|36.28|120.0|2
Düsseldorf|Germany|51.22|6.78|0
Suizhou|China|31.71|113.36|2
Villa Nueva|Guatemala|14.53|-90.59|2
Khabarovsk|Russia|48.46|135.1|0
Cuiabá|Brazil|-15.6|-56.1|2
Arusha|Tanzania|-3.37|36.68|2
Feira de Santana|Brazil|-12.27|-38.97|2
Chizhou|China|30.66|117.48|2
Coyoacán|Mexico|19.35|-99.16|2
Stuttgart|Germany|48.78|9.18|0
Ya'an|China|29.99|103.0|2
Cuttack|India|20.46|85.88|2
Borivli|India|19.23|72.86|2
Chiclayo|Peru|-6.77|-79.85|2
Yaroslavl|Russia|57.63|39.87|0
Gothenburg|Sweden|57.71|11.97|0
Kawaguchi|Japan|35.81|139.71|2
Bukit Rahman Putra|Malaysia|3.22|101.56|2
Jhang Sadr|Pakistan|31.27|72.32|0
Ha'il|Saudi Arabia|27.52|41.69|2
Bhavnagar|India|21.76|72.15|2
Benoni|South Africa|-26.19|28.32|2
Vladivostok|Russia|43.11|131.87|0
Tuxtla|Mexico|16.75|-93.12|0
Kryvyy Rih|Ukraine|47.91|33.39|0
Sanming|China|26.25|117.62|2
Islamabad|Pakistan|33.72|73.04|0
Sāngli|India|16.85|74.56|2
Jamnagar|India|22.47|70.07|0
Lubango|Angola|-14.92|13.49|2
Pokhara|Nepal|28.27|83.97|2
Shuangyashan|China|46.68|131.13|2
Borama|Somalia|9.94|43.18|2
Pallabi|Bangladesh|23.82|90.37|2
Luancheng|China|37.88|114.65|2
Makhachkala|Russia|42.98|47.5|0
Anyang-si|South Korea|37.39|126.93|2
Huambo|Angola|-12.78|15.74|2
Samarkand|Uzbekistan|39.65|66.96|2
Mengzi|China|23.37|103.38|2
Kagoshima|Japan|31.57|130.55|2
Mukalla|Yemen|14.54|49.12|2
Rasht|Iran|37.28|49.59|2
Mar del Plata|Argentina|-38.0|-57.56|0
Essen|Germany|51.46|7.01|0
Al Maḩallah al Kubrá|Egypt|30.97|31.17|2
Málaga|Spain|36.72|-4.42|0
Shekhupura|Pakistan|31.71|73.99|2
Yingkou|China|40.66|122.23|2
Zhangzhou|China|24.51|117.66|0
Reynosa|Mexico|26.08|-98.28|2
Thuận An|Vietnam|10.92|106.71|2
Dortmund|Germany|51.51|7.47|2
Suginami|Japan|36.2|140.28|2
Baltimore|United States|39.29|-76.61|0
Cimahi|Indonesia|-6.87|107.54|2
Londrina|Brazil|-23.31|-51.16|2
Bucaramanga|Colombia|7.12|-73.12|2
Genoa|Italy|44.4|8.94|0
Fengcheng|China|40.45|124.07|2
Hachiōji|Japan|35.66|139.32|2
Malacca|Malaysia|2.2|102.24|2
Nha Trang|Vietnam|12.25|109.19|0
Kerman|Iran|30.28|57.08|2
Orūmīyeh|Iran|37.55|45.08|2
Tanta|Egypt|30.79|31.0|2
Jammu|India|32.74|74.86|2
Iskandar Puteri|Malaysia|1.39|103.62|2
Calamba|Philippines|14.21|121.17|2
Lanxi|China|29.22|119.47|2
Herāt|Afghanistan|34.35|62.2|2
Dongsheng|China|39.82|109.98|2
Gujrat|Pakistan|32.57|74.08|2
Tomsk|Russia|56.5|84.98|2
Umraniye|Turkey|41.02|29.12|2
Shihezi|China|44.3|86.04|2
South Boston|United States|42.33|-71.05|2
Nakuru|Kenya|-0.31|36.07|2
Hamilton|Canada|43.25|-79.85|2
Irbid|Jordan|32.56|35.85|2
Manchester|United Kingdom|53.48|-2.24|0
Kota Bharu|Malaysia|6.12|102.24|2
Surrey|Canada|49.11|-122.83|2
Meknes|Morocco|33.89|-5.55|2
Puente Alto|Chile|-33.61|-70.58|2
Nyala|Sudan|12.05|24.88|2
Xinmin|China|41.99|122.83|2
Dresden|Germany|51.05|13.74|0
Orenburg|Russia|51.77|55.1|0
Albuquerque|United States|35.08|-106.65|0
Bokāro|India|23.67|86.15|2
Asmara|Eritrea|15.34|38.93|0
Sukkur|Pakistan|27.7|68.86|2
Milwaukee|United States|43.04|-87.91|0
Chợ Lớn|Vietnam|10.75|106.65|2
Wenchang|China|19.55|110.8|2
Ile-Ife|Nigeria|7.48|4.56|2
Gombe|Nigeria|10.29|11.17|2
Hamhŭng|North Korea|39.92|127.54|2
Kemerovo|Russia|55.35|86.1|2
Nasiriyah|Iraq|31.06|46.26|2
Bloemfontein|South Africa|-29.12|26.21|0
Sheffield|United Kingdom|53.38|-1.47|0
Santiago de Cuba|Cuba|20.02|-75.82|0
Cuautitlán Izcalli|Mexico|19.64|-99.22|2
Benguela|Angola|-12.58|13.4|2
Chuxiong|China|25.04|101.55|2
Yanzhou|China|35.55|116.83|2
Huaihua|China|27.56|110.0|2
Sishui|China|35.65|117.28|2
Muntinlupa|Philippines|14.39|121.05|2
Zahedan|Iran|29.5|60.86|2
Banqiao|Taiwan|25.01|121.47|2
Nanded|India|19.16|77.31|2
Kozhikode|India|11.25|75.78|0
Ulanqab|China|40.99|113.13|2
Cabinda|Angola|-5.56|12.19|2
Ajegunle|Nigeria|6.45|3.33|2
Pristina|Kosovo|42.67|21.17|0
Jiamusi|China|46.8|130.31|0
Korla|China|41.76|86.15|0
Kolhāpur|India|16.7|74.23|2
Porto Velho|Brazil|-8.76|-63.9|0
San Miguel de Tucumán|Argentina|-26.82|-65.21|0
Kuantan|Malaysia|3.81|103.33|2
Sevastopol|Ukraine|44.61|33.52|0
Nellore|India|14.45|79.99|2
Bremen|Germany|53.08|8.81|0
Wanning|China|18.8|110.38|2
Owerri|Nigeria|5.48|7.03|2
Kota Kuala Muda|Malaysia|5.59|100.37|2
Sungai Petani|Malaysia|5.65|100.49|2
Xinzhou|China|38.41|112.73|2
Kalaburagi|India|17.34|76.84|2
Tucson|United States|32.22|-110.93|0
Selayang Baru Utara|Malaysia|3.25|101.67|2
Vilnius|Lithuania|54.69|25.28|0
Ajmer|India|26.45|74.64|0
Pingdu|China|36.78|119.95|2
Fresno|United States|36.75|-119.77|2
Mbeya|Tanzania|-8.9|33.45|2
Juiz de Fora|Brazil|-21.76|-43.35|2
Calabar|Nigeria|4.96|8.33|2
Oujda|Morocco|34.68|-1.91|0
Novokuznetsk|Russia|53.76|87.14|0
Ryazan’|Russia|54.63|39.7|2
Ji’an|China|27.12|114.98|2
Sahiwal|Pakistan|31.97|72.33|2
Mersin|Turkey|36.81|34.64|2
Nilüfer|Turkey|40.21|28.92|2
Leeds|United Kingdom|53.8|-1.55|0
Poznań|Poland|52.41|16.93|0
Aqsu|China|41.18|80.28|0
Ebute Ikorodu|Nigeria|6.6|3.49|2
Ananindeua|Brazil|-1.37|-48.37|2
Tanggu|China|39.02|117.65|2
Pasir Gudang|Malaysia|1.46|103.91|2
Astrakhan|Russia|46.35|48.04|0
Okara|Pakistan|30.81|73.45|2
Nansana|Uganda|0.36|32.53|2
Kimhae|South Korea|35.23|128.88|2
Ar Raqqah|Syria|35.95|39.01|0
Québec|Canada|46.81|-71.21|0
Shangluo|China|33.87|109.93|2
Himeji|Japan|34.82|134.7|2
Duyun|China|26.27|107.52|2
Ibagué|Colombia|4.44|-75.2|2
Antwerp|Belgium|51.22|4.4|0
Assiut|Egypt|27.18|31.18|2
Hamadān|Iran|34.8|48.51|2
Qionghai|China|19.24|110.46|2
Aparecida de Goiânia|Brazil|-16.82|-49.24|2
Cangzhou|China|38.31|116.85|0
Mohammadpur|Bangladesh|24.9|88.53|2
Surakarta|Indonesia|-7.56|110.83|2
Yuanping|China|38.72|112.76|2
San Salvador|El Salvador|13.69|-89.19|0
Beihai|China|21.48|109.12|2
Van|Turkey|38.49|43.38|2
Sacramento|United States|38.58|-121.49|0
Thủ Đức|Vietnam|10.85|106.77|2
Üsküdar|Turkey|41.02|29.01|2
Penza|Russia|53.2|45.01|2
Mazār-e Sharīf|Afghanistan|36.71|67.11|2
Kandahār|Afghanistan|31.61|65.71|2
Hengshui|China|37.74|115.68|2
Dehradun|India|30.32|78.03|0
Erode|India|11.34|77.73|2
Lyon|France|45.75|4.85|0
Salta|Argentina|-24.81|-65.42|2
Serra|Brazil|-20.13|-40.31|2
Daxing’anling|China|52.33|124.71|2
Qui Nhon|Vietnam|13.78|109.22|2
Al Fayyum|Egypt|29.31|30.84|2
Durgapur|India|23.52|87.31|2
Utsunomiya|Japan|36.57|139.88|2
Victoria de Durango|Mexico|24.02|-104.66|2
Belford Roxo|Brazil|-22.76|-43.4|2
Lisbon|Portugal|38.73|-9.15|0
Rahim Yar Khan|Pakistan|28.42|70.3|2
Ulhasnagar|India|19.22|73.15|0
Guangyuan|China|32.44|105.82|2
Loni|India|28.75|77.29|2
Siliguri|India|26.71|88.43|2
Nuremberg|Germany|49.45|11.08|0
Niterói|Brazil|-22.88|-43.1|2
Ujjain|India|23.18|75.78|0
Hannover|Germany|52.37|9.73|0
Edinburgh|United Kingdom|55.95|-3.2|0
Macapá|Brazil|0.04|-51.07|2
Xianning|China|29.84|114.32|2
Toulouse|France|43.6|1.44|0
Thembisa|South Africa|-26.0|28.23|2
Carrefour|Haiti|18.53|-72.4|2
Matsuyama|Japan|33.84|132.77|2
Bilimora|India|20.77|72.96|2
Kasur|Pakistan|31.12|74.45|2
Atlanta|United States|33.75|-84.39|0
Heroica Matamoros|Mexico|25.88|-97.5|2
Tonghua|China|41.72|125.93|2
Mianzhu, Deyang, Sichuan|China|31.34|104.22|2
Naberezhnyye Chelny|Russia|55.74|52.42|2
Lipetsk|Russia|52.59|39.55|0
Kikwit|Democratic Republic of the Congo|-5.04|18.82|2
Florianópolis|Brazil|-27.6|-48.55|0
Banan|China|29.38|106.54|2
Newcastle|Australia|-32.93|151.78|0
Tuen Mun|Hong Kong|22.39|113.97|2
Zhangye|China|38.93|100.45|2
Kirov|Russia|58.6|49.66|0
Kashgar|China|39.47|75.99|0
Mukim Pulai|Malaysia|1.53|103.67|2
Najrān|Saudi Arabia|17.49|44.13|2
Zhoukou|China|33.63|114.63|2
Leipzig|Germany|51.34|12.37|0
Pingliang|China|35.54|106.69|2
Kalininskiy|Russia|60.0|30.39|2
Duisburg|Germany|51.43|6.77|0
Āsansol|India|23.68|86.98|2
Arāk|Iran|34.09|49.7|2
Maipú|Chile|-33.51|-70.77|2
Homyel'|Belarus|52.43|30.98|0
Aktobe|Kazakhstan|50.28|57.21|0
Kota Kinabalu|Malaysia|5.97|116.07|2
Talatona|Angola|-8.92|13.19|2
Saminaka|Nigeria|10.41|8.69|2
Jalalpur Pirwala|Pakistan|29.51|71.22|2
Mangaluru|India|12.92|74.86|0
Santa Marta|Colombia|11.24|-74.19|2
Matsudo|Japan|35.78|139.9|2
Hāthazāri|Bangladesh|22.51|91.81|2
Karagandy|Kazakhstan|49.8|73.1|2
Loudi|China|27.73|111.99|2
Liverpool|United Kingdom|53.41|-2.98|0
Bāndarban|Bangladesh|22.2|92.22|2
Sha Tin|Hong Kong|22.38|114.18|2
Dera Ghazi Khan|Pakistan|30.05|70.64|2
Hecun|China|36.53|114.11|2
Higashiosaka|Japan|34.67|135.58|2
Pindi Bhattian|Pakistan|31.9|73.27|2
Cheboksary|Russia|56.13|47.25|0
Pohang|South Korea|36.03|129.36|2
Shanwei|China|22.78|115.35|2
Montería|Colombia|8.75|-75.88|2
Ruiru|Kenya|-1.15|36.96|2
Valledupar|Colombia|10.47|-73.25|2
Belagavi|India|15.85|74.5|0
Ajman|United Arab Emirates|25.4|55.48|2
Jianshui|China|24.28|101.22|2
Sancaktepe|Turkey|41.0|29.23|2
Port Sudan|Sudan|19.62|37.22|0
Toluca|Mexico|19.29|-99.65|2
Ciudad López Mateos|Mexico|19.56|-99.26|2
Al Khuşūş|Egypt|30.15|31.32|2
Jeju City|South Korea|33.51|126.52|0
Gdańsk|Poland|54.35|18.65|0
Miami|United States|25.77|-80.19|0
Omaha|United States|41.26|-95.94|2
Nishinomiya|Japan|34.72|135.33|2
Masina|Democratic Republic of the Congo|-4.38|15.39|2
Sahāranpur|India|29.97|77.55|2
Vellore|India|12.92|79.13|2
Donghe|China|40.57|110.02|2
Kurashiki|Japan|34.58|133.77|2
Campos dos Goytacazes|Brazil|-21.75|-41.33|2
Angeles City|Philippines|15.15|120.58|2
Bhātpāra|India|22.87|88.4|2
Jijiga|Ethiopia|9.35|42.8|2
Tula|Russia|54.2|37.62|2
Najaf|Iraq|32.03|44.35|0
Raleigh|United States|35.77|-78.64|0
Imus|Philippines|14.43|120.94|2
Xichang|China|27.9|102.26|2
Malegaon|India|20.55|74.53|2
São José do Rio Preto|Brazil|-20.82|-49.38|2
Caxias do Sul|Brazil|-29.17|-51.18|2
Okene|Nigeria|7.55|6.24|2
Uijeongbu-si|South Korea|37.74|127.05|2
Bristol|United Kingdom|51.46|-2.6|0
East London|South Africa|-33.02|27.91|2
Chéngguān Qū|China|29.64|91.04|2
Yazd|Iran|31.9|54.37|2
Hargeysa|Somalia|9.56|44.06|2
Ōita|Japan|33.23|131.6|2
Jincheng|China|35.5|112.83|2
Hongjiang|China|27.11|110.0|2
Modīnagar|India|28.83|77.57|2
Taoyuan|Taiwan|24.99|121.3|2
Eldoret|Kenya|0.52|35.27|2
Kansas City|United States|39.1|-94.58|0
Yan’an|China|36.6|109.49|2
Kaliningrad|Russia|54.71|20.51|0
Skopje|North Macedonia|42.0|21.43|0
Kupang|Indonesia|-10.17|123.61|2
Vereeniging|South Africa|-26.67|27.93|2
The Hague|The Netherlands|52.08|4.3|0
Long Beach|United States|33.77|-118.19|0
Gaya|India|24.8|85.0|2
Iloilo|Philippines|10.7|122.56|2
Xiulin|China|29.72|112.4|2
Jingdezhen|China|29.29|117.21|2
Murcia|Spain|37.99|-1.13|2
Mesa|United States|33.42|-111.82|2
Halifax|Canada|44.64|-63.58|2
Morogoro|Tanzania|-6.82|37.66|2
Kenitra|Morocco|34.26|-6.58|2
Seeb|Oman|23.67|58.19|2
Cilegon|Indonesia|-6.01|106.05|2
Mykolayiv|Ukraine|46.98|31.99|2
Fukuyama|Japan|34.48|133.37|2
Staten Island|United States|40.56|-74.14|2
Nanping|China|26.64|118.17|2
Pereira|Colombia|4.81|-75.69|2
Ciudad Apodaca|Mexico|25.78|-100.19|2
Ambattur|India|13.1|80.16|2
Kanazawa|Japan|36.6|136.62|2
Gonder|Ethiopia|12.6|37.47|2
Mixco|Guatemala|14.63|-90.61|2
Longshan|China|42.89|125.14|0
Ikare|Nigeria|7.53|5.75|2
Vũng Tàu|Vietnam|10.35|107.08|2
Maracay|Venezuela|10.25|-67.59|2
Tamale|Ghana|9.4|-0.84|2
Heyuan|China|23.73|114.68|2
Kira|Uganda|0.4|32.63|2
Esna|Egypt|25.29|32.55|2
Huangshan|China|29.71|118.31|0
Ḩamāh|Syria|35.13|36.76|2
Jalgaon|India|21.0|75.57|2
Kurnool|India|15.83|78.04|0
Yola|Nigeria|9.21|12.48|2
Rạch Giá|Vietnam|10.01|105.08|2
Amagasaki|Japan|34.72|135.42|2
Manado|Indonesia|1.48|124.85|2
Santo Domingo de los Colorados|Ecuador|-0.25|-79.18|2
Ţarţūs|Syria|34.89|35.89|2
Mek'ele|Ethiopia|13.5|39.48|2
Nazrēt|Ethiopia|8.55|39.27|2
Colorado Springs|United States|38.83|-104.82|0
Huancayo|Peru|-12.07|-75.21|2
Al Hillah|Iraq|32.46|44.42|2
Mbandaka|Democratic Republic of the Congo|0.05|18.26|2
Malanje|Angola|-9.54|16.34|2
Namp’o|North Korea|38.74|125.41|2
Ciudad General Escobedo|Mexico|25.8|-100.32|2
Bacolod City|Philippines|10.67|122.95|2
Virginia Beach|United States|36.85|-75.98|0
Wafangdian|China|39.62|122.01|2
Mansilingan|Philippines|10.63|122.98|2
Kahama|Tanzania|-3.83|32.6|2
Hsinchu|Taiwan|24.8|120.97|2
Katsushika|Japan|35.73|139.85|2
Rāmgundam|India|18.8|79.45|2
Batman|Turkey|37.89|41.13|2
Yongji|China|34.87|110.44|2
Lishui|China|28.46|119.91|0
Udaipur|India|24.59|73.71|2
Warder|Ethiopia|6.97|45.34|2
Wenshan City|China|23.36|104.25|2
Eslamshahr|Iran|35.55|51.24|2
Juba|South Sudan|4.85|31.58|0
Muratpaşa|Turkey|36.89|30.76|2
Bắc Giang|Vietnam|21.27|106.19|2
Şanlıurfa|Turkey|37.17|38.79|0
Kursk|Russia|51.73|36.18|2
Maheshtala|India|22.51|88.25|2
Nam Định|Vietnam|20.43|106.18|2
Constantine|Algeria|36.37|6.61|2
Patiāla|India|30.34|76.39|2
Basuo|China|19.1|108.67|2
Campina Grande|Brazil|-7.23|-35.88|2
Ensenada|Mexico|31.87|-116.6|2
Elazığ|Turkey|38.67|39.22|0
Jundiaí|Brazil|-23.19|-46.88|2
Xochimilco|Mexico|19.25|-99.1|2
Shyamnagar|India|22.83|88.37|2
Dasmariñas|Philippines|14.33|120.94|2
Zhangjiajie|China|29.13|110.48|2
Mataram|Indonesia|-8.58|116.12|2
Korhogo|Ivory Coast|9.46|-5.63|2
Piracicaba|Brazil|-22.73|-47.65|2
Beipiao|China|41.79|120.78|2
Fujisawa|Japan|35.35|139.48|2
Bissau|Guinea-Bissau|11.86|-15.6|0
Sandakan|Malaysia|5.84|118.12|2
Mawlamyine|Myanmar|16.49|97.63|0
Laval|Canada|45.57|-73.69|2
Palma|Spain|39.57|2.65|2
Montes Claros|Brazil|-16.73|-43.86|2
Jiexiu|China|37.02|111.91|2
Sunch’ŏn|North Korea|39.43|125.93|2
Sultangazi|Turkey|41.11|28.87|2
Uyo|Nigeria|5.05|7.93|2
Bei’an|China|48.27|126.6|2
Davangere|India|14.47|75.93|2
Ado-Ekiti|Nigeria|7.62|5.22|2
Manizales|Colombia|5.07|-75.51|2
Masan|South Korea|35.13|126.83|2
Buôn Ma Thuột|Vietnam|12.67|108.04|2
Stavropol|Russia|45.03|41.96|2
Shuozhou|China|39.32|112.42|2
Kashiwa|Japan|35.86|139.98|2
Ogbomoso|Nigeria|8.13|4.24|2
Tel Aviv|Israel|32.08|34.78|0
Goma|Democratic Republic of the Congo|-1.67|29.23|2
Buenaventura|Colombia|3.58|-77.0|2
Welkom|South Africa|-27.98|26.74|2
Machida|Japan|35.54|139.45|2
Zagazig|Egypt|30.59|31.5|2
Vinnytsya|Ukraine|49.23|28.47|2
Ismailia|Egypt|30.6|32.27|0
Ningde|China|26.66|119.52|2
Akola|India|20.71|77.0|2
Cusco|Peru|-13.53|-71.97|0
Jiuquan|China|39.74|98.52|0
Veracruz|Mexico|19.18|-96.14|2
Bryansk|Russia|53.27|34.32|2
Maltepe|Turkey|40.94|29.16|2
Sumgayit|Azerbaijan|40.59|49.67|2
Tando Bago|Pakistan|24.79|68.97|2
Kuala Terengganu|Malaysia|5.33|103.14|2
Toyota|Japan|35.08|137.15|2
Matadi|Democratic Republic of the Congo|-5.84|13.46|2
Al Kharj|Saudi Arabia|24.16|47.33|2
Minna|Nigeria|9.62|6.55|2
Xalapa de Enríquez|Mexico|19.53|-96.92|2
Rajpur Sonarpur|India|22.44|88.43|2
Bratislava|Slovakia|48.15|17.11|0
Shinagawa|Japan|33.64|133.01|2
Al Ḩasakah|Syria|36.5|40.75|0
Luxor|Egypt|25.7|32.64|0
London|Canada|42.98|-81.23|2
Beining|China|41.6|121.79|2
Awasa|Ethiopia|7.06|38.48|2
Chimoio|Mozambique|-19.12|33.48|2
Tando Allahyar|Pakistan|25.46|68.72|2
Daloa|Ivory Coast|6.88|-6.45|2
Barra da Tijuca|Brazil|-23.0|-43.37|2
Dingxi|China|35.57|104.62|2
Laohekou|China|32.39|111.67|2
Bamenda|Cameroon|5.96|10.15|2
Tver|Russia|56.86|35.9|2
Thái Nguyên|Vietnam|21.59|105.85|2
Boa Vista|Brazil|2.82|-60.67|2
Rio Branco|Brazil|-9.97|-67.81|0
Oakland|United States|37.8|-122.27|0
Christchurch|New Zealand|-43.53|172.63|0
Korba|India|22.35|82.7|2
Takamatsu|Japan|34.33|134.05|2
Santos|Brazil|-23.96|-46.33|2
Tirana|Albania|41.33|19.82|0
Petrolina|Brazil|-9.4|-40.5|2
San Juan|Puerto Rico|18.47|-66.11|0
Alor Setar|Malaysia|6.12|100.36|0
Tongchuan|China|34.9|108.95|2
Nuevo Laredo|Mexico|27.48|-99.52|2
Toyama|Japan|36.7|137.22|2
Tétouan|Morocco|35.58|-5.37|2
Zürich|Switzerland|47.37|8.55|0
Beylikdüzü|Turkey|40.98|28.64|2
Việt Trì|Vietnam|21.32|105.4|2
Tampa|United States|27.95|-82.46|2
Magnitogorsk|Russia|53.4|59.01|2
Tulsa|United States|36.15|-95.99|2
Jhānsi|India|25.46|78.58|2
Ciudad Bolívar|Venezuela|8.12|-63.55|0
Koumassi|Ivory Coast|5.3|-3.97|2
Guyuan|China|36.01|106.28|2
Wandsbek|Germany|53.58|10.08|2
Minneapolis|United States|44.98|-93.26|0
Jayapura|Indonesia|-2.53|140.72|2
Thoothukudi|India|8.77|78.13|2
Ardabīl|Iran|38.25|48.29|2
Ballari|India|15.14|76.92|2
Chaoyang|China|41.57|120.46|2
Gaza|Palestinian Territory|31.5|34.47|0
Maringá|Brazil|-23.43|-51.94|2
Yokosuka|Japan|35.28|139.67|2
Kom Ombo|Egypt|24.48|32.95|2
Nagasaki|Japan|32.75|129.88|2
Gujangbagh|China|37.11|79.93|0
Tonalá|Mexico|20.62|-103.24|2
Zhijiang|China|30.42|111.75|2
Panama City|Panama|8.99|-79.52|0
Uvira|Democratic Republic of the Congo|-3.4|29.14|2
Lengshuijiang|China|27.69|111.43|2
Hirakata|Japan|34.81|135.65|2
Ivanovo|Russia|57.0|40.97|0
Cumaná|Venezuela|10.46|-64.18|2
Newcastle|South Africa|-27.76|29.93|2
Gumi|South Korea|36.11|128.34|2
Jixi|China|45.29|130.96|2
Kuching|Malaysia|1.55|110.33|2
Gifu|Japan|35.42|136.76|2
Caruaru|Brazil|-8.28|-35.98|2
Tongling|China|30.95|117.78|2
Tarlac City|Philippines|15.48|120.6|2
Toyonaka|Japan|34.78|135.47|2
Kassala|Sudan|15.45|36.4|2
Miyazaki|Japan|31.92|131.42|2
Lekki|Nigeria|6.45|3.48|2
Antofagasta|Chile|-23.65|-70.4|0
Wah Cantt|Pakistan|33.77|72.75|2
Bhāgalpur|India|25.24|86.97|2
Agartala|India|23.84|91.28|2
Dayrah|United Arab Emirates|25.27|55.3|2
Bida|Nigeria|9.08|6.01|2
Bunia|Democratic Republic of the Congo|1.56|30.25|2
Antakya|Turkey|36.21|36.16|0
Sunshine Coast|Australia|-26.66|153.08|2
Lüshun|China|38.8|121.27|2
Kisumu|Kenya|-0.1|34.76|2
Luhansk|Ukraine|48.57|39.31|0
Bengkulu|Indonesia|-3.8|102.27|2
Barinas|Venezuela|8.62|-70.23|2
Hancheng|China|35.46|110.43|2
Vitória da Conquista|Brazil|-14.87|-40.84|2
Wichita|United States|37.69|-97.34|0
Al Hoceïma|Morocco|35.25|-3.94|2
Szczecin|Poland|53.43|14.55|0
Liaozhong|China|41.51|122.72|2
Vila Velha|Brazil|-20.33|-40.29|2
Bologna|Italy|44.49|11.34|2
Sejong|South Korea|36.59|127.29|2
Samsun|Turkey|41.28|36.34|2
Tallinn|Estonia|59.44|24.75|0
Tanga|Tanzania|-5.07|39.1|2
El Obeid|Sudan|13.18|30.22|2
Lobito|Angola|-12.36|13.54|0
Saurimo|Angola|-9.66|20.39|2
Bauru|Brazil|-22.31|-49.06|2
Bello|Colombia|6.34|-75.56|2
Pasto|Colombia|1.21|-77.28|2
Gaomi|China|36.38|119.75|2
Santa Fe|Argentina|-31.65|-60.71|2
San-Pédro|Ivory Coast|4.75|-6.64|2
Makurdi|Nigeria|7.73|8.52|2
Palu|Indonesia|-0.91|119.87|2
Takoradi|Ghana|4.9|-1.76|2
Samut Prakan|Thailand|13.6|100.6|2
Arlington|United States|32.74|-97.11|2
Khamis Mushait|Saudi Arabia|18.3|42.73|2
Ambato|Ecuador|-1.25|-78.62|2
Ojo de Agua|Mexico|19.68|-99.01|2
Windhoek|Namibia|-22.56|17.08|0
Bochum|Germany|51.48|7.22|2
Sector 3|Romania|44.42|26.17|2
Chak Jhumra|Pakistan|31.57|73.18|2
Kahramanmaraş|Turkey|37.58|36.93|0
Chongzuo|China|22.38|107.37|2
Grajaú|Brazil|-23.77|-46.67|2
Okazaki|Japan|34.95|137.17|2
Xico|Mexico|19.27|-98.95|2
Kākināda|India|16.96|82.24|2
Betim|Brazil|-19.97|-44.2|2
Las Palmas de Gran Canaria|Spain|28.1|-15.42|2
Cotabato|Philippines|7.22|124.25|2
Latur|India|18.4|76.57|2
Tanzhou|China|22.26|113.47|2
Wellington|New Zealand|-41.29|174.78|0
Mazatlán|Mexico|23.22|-106.42|2
Nizhny Tagil|Russia|57.92|59.97|2
Irapuato|Mexico|20.67|-101.36|2
Ichinomiya|Japan|35.3|136.8|2
Aswān|Egypt|24.09|32.9|2
Brno|Czechia|49.2|16.61|2
Iaşi|Romania|47.17|27.6|0
Krugersdorp|South Africa|-26.09|27.78|2
Pānihāti|India|22.69|88.37|2
Shibganj|Bangladesh|25.0|89.32|2
Caucaia|Brazil|-3.74|-38.65|2
Iquitos|Peru|-3.75|-73.25|2
Toyohashi|Japan|34.77|137.38|2
Utrecht|The Netherlands|52.09|5.12|0
Rajamahendravaram|India|17.01|81.78|2
Cariacica|Brazil|-20.26|-40.42|2
Yogyakarta|Indonesia|-7.8|110.36|0
Dhule|India|20.9|74.78|2
Minato|Japan|34.22|135.15|2
Ondo|Nigeria|7.09|4.84|2
Pingyin|China|36.28|116.45|2
Rohtak|India|28.89|76.59|2
Bhawana|Pakistan|31.57|72.65|2
Rustenburg|South Africa|-25.67|27.24|2
Bakersfield|United States|35.37|-119.02|2
Xuanhua|China|40.61|115.06|2
Emalahleni|South Africa|-25.87|29.23|2
Bafoussam|Cameroon|5.48|10.42|2
Thủ Dầu Một|Vietnam|10.98|106.65|2
Takasaki|Japan|36.33|139.02|2
Seremban|Malaysia|2.73|101.94|2
Nagano|Japan|36.65|138.18|2
Tawau|Malaysia|4.24|117.89|2
Cardiff|United Kingdom|51.48|-3.18|0
Chitungwiza|Zimbabwe|-18.01|31.08|2
Fenghuang|China|27.94|109.6|2
Umuahia|Nigeria|5.52|7.49|2
Puerto La Cruz|Venezuela|10.21|-64.63|2
Uşak|Turkey|38.67|29.41|2
Bharatpur|Nepal|27.68|84.44|0
Itaquaquecetuba|Brazil|-23.49|-46.35|2
Natore|Bangladesh|24.41|88.99|2
6th of October City|Egypt|29.82|31.05|2
Leicester|United Kingdom|52.64|-1.13|2
Desna|Ukraine|50.52|30.68|2
Cascavel|Brazil|-24.96|-53.46|2
Sector 6|Romania|44.44|26.02|2
Canberra|Australia|-35.28|149.13|0
Avellaneda|Argentina|-34.66|-58.37|2
Praia Grande|Brazil|-24.01|-46.4|2
Nara-shi|Japan|34.69|135.8|2
Florence|Italy|43.78|11.25|0
Ahilyanagar|India|19.09|74.74|2
Kollam|India|8.88|76.58|2
Huanggang|China|30.45|114.87|2
Bradford|United Kingdom|53.79|-1.75|2
Sukabumi|Indonesia|-6.92|106.93|2
Bilāspur|India|22.08|82.16|2
Malabon|Philippines|14.67|120.94|2
Franca|Brazil|-20.54|-47.4|2
Cleveland|United States|41.5|-81.7|0
Iseyin|Nigeria|7.97|3.6|2
Etobicoke|Canada|43.64|-79.57|2
Yenagoa|Nigeria|4.93|6.27|2
Gboko|Nigeria|7.32|9.0|2
Olinda|Brazil|-8.01|-34.86|2
Pyeongtaek|South Korea|36.99|127.09|2
Petare|Venezuela|10.48|-66.81|2
Bến Cát|Vietnam|11.15|106.6|2
Alanya|Turkey|36.54|32.0|2
Larkana|Pakistan|27.56|68.21|2
Al Qadarif|Sudan|14.03|35.38|2
Hrodna|Belarus|53.68|23.83|2
Cibinong|Indonesia|-6.48|106.85|2
Nawabshah|Pakistan|26.24|68.4|2
New Orleans|United States|29.95|-90.08|0
Keelung|Taiwan|25.13|121.74|2
Malmö|Sweden|55.61|13.0|2
Jizhou|China|37.55|115.57|2
Manukau City|New Zealand|-36.99|174.88|2
Maradi|Niger|13.5|7.1|2
Burewala|Pakistan|30.17|72.65|2
Blumenau|Brazil|-26.92|-49.07|2
Nanqiao|China|30.92|121.45|2
Mingora|Pakistan|34.78|72.36|0
Santarém|Brazil|-2.44|-54.71|2
Wuppertal|Germany|51.26|7.15|2
Ulan-Ude|Russia|51.83|107.6|0
Huocheng|China|44.05|80.87|2
Ijebu Ode|Nigeria|6.82|3.92|2
Maseru|Lesotho|-29.32|27.48|0
Bhilwara|India|25.35|74.64|2
Aurora|United States|39.73|-104.83|2
Vitebsk|Belarus|55.19|30.2|0
Sultanbeyli|Turkey|40.96|29.27|2
Taraz|Kazakhstan|42.9|71.37|2
Yangsan|South Korea|35.34|129.03|2
Dniprovskyi|Ukraine|50.45|30.6|2
San Jose del Monte|Philippines|14.81|121.05|2
Abū al-Kahṣīb|Iraq|30.44|47.88|2
Gwangmyeong|South Korea|37.48|126.87|2
Zanjan|Iran|36.68|48.5|2
Neiva|Colombia|2.93|-75.28|2
Iwaki|Japan|37.05|140.88|2
Vladimir|Russia|56.14|40.4|0
Tete|Mozambique|-16.16|33.59|2
Bacoor|Philippines|14.46|120.94|2
Uberaba|Brazil|-19.75|-47.93|2
Brahmapur|India|19.31|84.79|2
Fengshan|Taiwan|22.63|120.36|2
Ulanhot|China|46.08|122.08|2
Misratah|Libya|32.38|15.09|2
Cuíto|Angola|-12.38|16.93|2
Kyzylorda|Kazakhstan|44.85|65.51|0
Sinjhoro|Pakistan|26.03|68.81|2
Kawagoe|Japan|35.91|139.49|2
Muzaffarpur|India|26.12|85.39|0
Tapachula|Mexico|14.91|-92.26|2
Lhoka|China|29.24|91.77|2
Villahermosa|Mexico|17.99|-92.94|2
Setapak|Malaysia|3.21|101.73|2
Mahilyow|Belarus|53.91|30.34|0
Bandar Abbas|Iran|27.19|56.28|0
Pravyi Bereh|Ukraine|47.11|37.59|2
Yunusobod|Uzbekistan|41.37|69.28|2
Ras Al Khaimah|United Arab Emirates|25.79|55.94|0
Cabimas|Venezuela|10.4|-71.45|2
Kendari|Indonesia|-3.98|122.52|2
Honolulu|United States|21.31|-157.86|0
Anaheim|United States|33.84|-117.91|2
Tarsus|Turkey|36.92|34.89|2
Pengze|China|29.9|116.55|2
Bahir Dar|Ethiopia|11.59|37.39|2
Punāsa|India|22.24|76.39|2
Al Maḩmūdīyah|Iraq|33.06|44.37|2
Diepsloot|South Africa|-25.93|28.01|2
Xilin Hot|China|43.97|116.03|2
Xilinhot|China|43.94|116.07|2
São José dos Pinhais|Brazil|-25.53|-49.21|2
Quelimane|Mozambique|-17.88|36.89|2
Arkhangel’sk|Russia|64.55|40.55|2
Muzaffarnagar|India|29.47|77.7|2
Hulunbuir|China|49.21|119.76|2
Dumai|Indonesia|1.67|101.44|2
Sikasso|Mali|11.32|-5.67|2
Sanandaj|Iran|35.31|47.0|0
Chita|Russia|52.04|113.49|2
Alicante|Spain|38.35|-0.48|0
Bimbo|Central African Republic|4.26|18.42|2
Kalemyo|Myanmar|23.19|94.06|2
Belfast|United Kingdom|54.6|-5.93|0
Long Bien|Vietnam|21.03|105.9|2
Camagüey|Cuba|21.38|-77.92|2
Bilbao|Spain|43.26|-2.93|2
Ambon|Indonesia|-3.7|128.18|2
Brest|Belarus|52.11|23.72|0
Ribeirão das Neves|Brazil|-19.77|-44.09|2
Chifeng|China|42.27|118.96|0
Central Coast|Australia|-33.43|151.37|2
Corrientes|Argentina|-27.47|-58.83|2
Hŭngnam|North Korea|39.84|127.63|2
Avadi|India|13.11|80.11|2
Yunlong|China|34.25|117.25|2
Koshigaya|Japan|35.89|139.79|2
Coventry|United Kingdom|52.41|-1.51|2
Belgorod|Russia|50.6|36.58|0
Toamasina|Madagascar|-18.15|49.4|2
Logan City|Australia|-27.64|153.11|2
Ōtsu|Japan|35.0|135.87|2
Kosti|Sudan|13.16|32.66|2
Qitaihe|China|45.77|131.0|2
Doha|Qatar|25.29|51.53|0
Kadapa|India|14.48|78.82|2
Cirebon|Indonesia|-6.71|108.56|2
Turmero|Venezuela|10.23|-67.47|2
Tokorozawa|Japan|35.8|139.47|2
Cabanatuan City|Philippines|15.49|120.97|2
Pizhou|China|34.31|117.95|2
Darnytsya|Ukraine|50.42|30.7|2
Dire Dawa|Ethiopia|9.59|41.87|2
Annaba|Algeria|36.9|7.77|2
Nice|France|43.7|7.27|0
Iligan|Philippines|8.23|124.24|2
Soledad|Colombia|10.92|-74.76|2
Temara|Morocco|33.93|-6.91|2
Paulista|Brazil|-7.94|-34.87|2
Obalende|Nigeria|6.45|3.42|2
Kukatpally|India|17.48|78.41|2
Laixi|China|36.86|120.53|2
Dihok|Iraq|36.87|42.99|2
Kaluga|Russia|54.53|36.27|2
Bắc Từ Liêm|Vietnam|21.07|105.75|2
Celaya|Mexico|20.52|-100.81|2
Serekunda|Gambia|13.44|-16.68|2
Karşıyaka|Turkey|38.46|27.11|2
Makiyivka|Ukraine|48.05|37.93|2
West Raleigh|United States|35.79|-78.66|2
Cuernavaca|Mexico|18.93|-99.23|2
Markham|Canada|43.87|-79.27|2
Kaesŏng|North Korea|37.97|126.55|2
Tungi|Bangladesh|23.89|90.4|2
Krasnogvargeisky|Russia|59.97|30.48|2
Randburg|South Africa|-26.09|28.0|2
Safi|Morocco|32.3|-9.24|2
Simferopol|Ukraine|44.96|34.11|0
Lublin|Poland|51.25|22.57|0
Pelotas|Brazil|-31.77|-52.34|2
San José|Costa Rica|9.93|-84.08|0
Orlando|United States|28.54|-81.38|2
Viña del Mar|Chile|-33.02|-71.55|2
Qazvin|Iran|36.27|50.0|2
Asahikawa|Japan|43.77|142.36|2
Tepic|Mexico|21.51|-104.89|2
Wŏnju|South Korea|37.35|127.95|2
Wad Medani|Sudan|14.4|33.52|2
Nukus|Uzbekistan|42.46|59.61|2
Maebashi|Japan|36.4|139.08|2
Ciudad Victoria|Mexico|23.74|-99.14|2
Soledad de Graciano Sánchez|Mexico|22.19|-100.94|2
Kochi|Japan|33.55|133.53|2
Bielefeld|Germany|52.03|8.53|2
Blida|Algeria|36.47|2.83|2
Ganja|Azerbaijan|40.68|46.36|0
Khorramshahr|Iran|30.44|48.18|0
Bonn|Germany|50.73|7.1|2
Mathura|India|27.5|77.67|2
Hechi|China|24.69|108.08|2
Bydgoszcz|Poland|53.12|18.01|0
Smolensk|Russia|54.78|32.05|0
Oral|Kazakhstan|51.25|51.43|0
Khorramabad|Iran|33.49|48.36|2
Soyapango|El Salvador|13.71|-89.14|2
Tongshan|China|34.18|117.16|2
Plovdiv|Bulgaria|42.15|24.75|0
Ciudad Obregón|Mexico|27.49|-109.94|2
Wŏnsan|North Korea|39.15|127.44|2
Brent|United Kingdom|51.55|-0.3|2
Pavlodar|Kazakhstan|52.28|76.97|0
Chānda|India|19.95|79.3|0
Canoas|Brazil|-29.92|-51.18|2
Kōriyama|Japan|37.4|140.38|2
Sochi|Russia|43.6|39.72|2
Aksaray|Turkey|38.37|34.03|2
Vijayapura|India|16.82|75.72|2
Chipata|Zambia|-13.63|32.65|2
Chongjin|North Korea|41.8|129.78|0
Yanji|China|42.89|129.5|2
Roodepoort|South Africa|-26.16|27.87|0
Pucallpa|Peru|-8.38|-74.55|2
Mogi das Cruzes|Brazil|-23.52|-46.19|2
Córdoba|Spain|37.89|-4.77|0
Nantes|France|47.22|-1.55|2
Ilesa|Nigeria|7.63|4.74|2
Pekalongan|Indonesia|-6.89|109.68|2
Bhatara|Bangladesh|23.8|90.45|2
Espoo|Finland|60.21|24.65|2
Kikuyu|Kenya|-1.25|36.66|2
Kluang|Malaysia|2.03|103.32|2
Lincang|China|23.88|100.09|2
Nottingham|United Kingdom|52.95|-1.15|2
Ramiros|Angola|-9.06|13.05|2
Al ‘Amārah|Iraq|31.84|47.14|2
Volzhsky|Russia|48.79|44.78|2
Vaughan|Canada|43.84|-79.5|2
Xingyi|China|25.1|104.91|2
Shivamogga|India|13.93|75.57|2
Alwar|India|27.56|76.62|0
Uíge|Angola|-7.61|15.06|2
Taubaté|Brazil|-23.03|-45.56|2
Ixtapaluca|Mexico|19.32|-98.88|2
Osh|Kyrgyzstan|40.53|72.8|0
Portoviejo|Ecuador|-1.06|-80.45|2
Villavicencio|Colombia|4.13|-73.63|2
Man’gyŏngdae-ri|North Korea|38.99|125.66|2
Camaçari|Brazil|-12.7|-38.32|2
San Miguelito|Panama|9.05|-79.47|2
Shāhjānpur|India|27.88|79.91|2
Lexington|United States|37.99|-84.48|2
Tantou|China|22.75|113.83|2
Anápolis|Brazil|-16.33|-48.95|2
Kaech’ŏn|North Korea|39.7|125.89|2
Jūnāgadh|India|21.52|70.46|2
Holguín|Cuba|20.89|-76.26|2
Ust-Kamenogorsk|Kazakhstan|49.97|82.61|2
Zinder|Niger|13.81|8.99|2
Saransk|Russia|54.18|45.17|0
Al Diwaniyah|Iraq|31.99|44.93|2
Varna|Bulgaria|43.22|27.91|0
Hafizabad|Pakistan|32.07|73.69|2
Marne La Vallée|France|48.84|2.64|2
Palangkaraya|Indonesia|-2.21|113.92|2
Damanhur|Egypt|31.03|30.47|2
Chiniot|Pakistan|31.72|72.98|2
Popayán|Colombia|2.44|-76.61|2
Reading|United Kingdom|51.46|-0.97|2
Geita|Tanzania|-2.87|32.23|2
Constanţa|Romania|44.18|28.63|0
New Delhi|India|28.62|77.21|0
Thessaloníki|Greece|40.64|22.93|0
Thiès|Senegal|14.79|-16.93|2
Naha|Japan|26.21|127.68|2
Riverside|United States|33.95|-117.4|2
Baicheng|China|45.62|122.83|2
Chimbote|Peru|-9.08|-78.59|2
Bari|Italy|41.12|16.87|2
Barueri|Brazil|-23.51|-46.88|2
Corpus Christi|United States|27.8|-97.4|2
Thrissur|India|10.52|76.22|2
Cherepovets|Russia|59.13|37.9|0
Eloy Alfaro|Ecuador|-2.17|-79.84|2
Al-Kut|Iraq|32.51|45.82|2
Muar|Malaysia|2.04|102.57|2
Şişli|Turkey|41.06|28.99|2
Maroua|Cameroon|10.59|14.32|2
Kingston upon Hull|United Kingdom|53.74|-0.34|2
Preston|United Kingdom|53.76|-2.7|2
Lianshan|China|40.76|120.85|2
Denizli|Turkey|37.77|29.09|2
New Cairo|Egypt|30.03|31.47|2
Al Qāhirah al Jadīdah|Egypt|30.04|31.44|2
Palmira|Colombia|3.54|-76.3|2
Vologda|Russia|59.22|39.88|2
Iligan City|Philippines|8.25|124.4|2
Catania|Italy|37.49|15.07|2
Jardim Angela|Brazil|-23.72|-46.77|2
Nizāmābād|India|18.67|78.1|2
Cincinnati|United States|39.13|-84.51|0
Percut|Indonesia|3.63|98.86|2
Coatzacoalcos|Mexico|18.15|-94.44|2
Santa Ana|United States|33.75|-117.87|2
Sariwŏn-si|North Korea|38.51|125.76|2
Botshabelo|South Africa|-29.27|26.73|2
Butuan|Philippines|8.95|125.54|2
Shahrīār|Iran|35.66|51.06|2
Kurgan|Russia|55.45|65.34|0
Tampico|Mexico|22.29|-97.88|2
Cabuyao|Philippines|14.27|121.13|2
Tabora|Tanzania|-5.02|32.83|2
Kasugai|Japan|35.25|136.97|2
An Nhơn|Vietnam|13.89|109.11|2
Ciudad Benito Juárez|Mexico|25.65|-100.09|2
Münster|Germany|51.96|7.63|2
Mannheim|Germany|49.49|8.47|2
Karawang|Indonesia|-6.31|107.32|2
Akita|Japan|39.72|140.12|2
Tumkūr|India|13.34|77.1|2
Chinju|South Korea|35.19|128.08|2
Parbhani|India|19.27|76.77|2
Hisar|India|29.15|75.72|2
Iksan|South Korea|35.94|126.95|2
Fīrozābād|India|27.15|78.4|2
Palmas|Brazil|-10.17|-48.33|2
Vladikavkaz|Russia|43.04|44.67|0
Port-de-Paix|Haiti|19.94|-72.83|2
Damietta|Egypt|31.42|31.81|0
Posadas|Argentina|-27.39|-55.92|2
Parauapebas|Brazil|-6.07|-49.9|2
Brakpan|South Africa|-26.24|28.37|2
Stockton|United States|37.96|-121.29|2
Juazeiro do Norte|Brazil|-7.21|-39.32|2
Yokkaichi|Japan|34.97|136.62|2
Kulti|India|23.73|86.84|2
Sapele|Nigeria|5.89|5.68|2
Kashan|Iran|33.98|51.43|2
Pittsburgh|United States|40.44|-80.0|0
Armenia|Colombia|4.54|-75.67|2
Santa Catarina|Mexico|25.67|-100.46|2
Sumbawanga|Tanzania|-7.97|31.62|2
Orël|Russia|52.97|36.08|2
Akashi|Japan|34.66|135.01|2
Kurume|Japan|33.32|130.52|2
Graz|Austria|47.07|15.44|0
Saint Paul|United States|44.94|-93.09|0
Nghi Sơn|Vietnam|19.33|105.82|2
Karnāl|India|29.69|76.98|2
Changyi|China|36.85|119.39|2
Ciudad del Este|Paraguay|-25.5|-54.65|0
Rosetta|Egypt|31.4|30.42|2
Barddhamān|India|23.26|87.86|2
Kediri|Indonesia|-7.82|112.02|2
Solwezi|Zambia|-12.17|26.39|2
Hamburg-Mitte|Germany|53.55|10.02|2
Augsburg|Germany|48.37|10.9|0
South Dublin|Ireland|53.29|-6.34|2
Valladolid|Spain|41.66|-4.72|0
Miri|Malaysia|4.4|113.99|2
Mardan|Pakistan|34.2|72.05|2
Surgut|Russia|61.26|73.42|2
Swansea|United Kingdom|51.62|-3.94|2
San Pablo|Philippines|14.07|121.33|2
Newcastle upon Tyne|United Kingdom|54.97|-1.61|0
Gatineau|Canada|45.48|-75.7|2
Yangshuo|China|24.78|110.49|2
Malir Cantonment|Pakistan|24.94|67.21|2
Winejok|South Sudan|9.01|27.57|2
Batikent|Turkey|39.97|32.73|2
Mérida|Venezuela|8.58|-71.17|2
Port Moresby|Papua New Guinea|-9.48|147.15|0
Yamoussoukro|Ivory Coast|6.82|-5.28|0
Ljubljana|Slovenia|46.05|14.51|0
Porto-Novo|Benin|6.5|2.6|0
Gaborone|Botswana|-24.65|25.91|0
Podgorica|Montenegro|42.44|19.26|0
Georgetown|Guyana|6.8|-58.16|0
Nassau|Bahamas|25.06|-77.34|0
Sucre|Bolivia|-19.03|-65.26|0
Paramaribo|Suriname|5.87|-55.17|0
Nicosia|Cyprus|35.17|33.35|0
Port Louis|Mauritius|-20.16|57.5|0
Saint-Denis|Reunion|-20.88|55.45|0
Dili|Timor Leste|-8.56|125.57|0
Manama|Bahrain|26.23|50.59|0
Praia|Cabo Verde|14.93|-23.51|0
Willemstad|Curacao|12.12|-68.89|0
Bern|Switzerland|46.95|7.45|0
Reykjavík|Iceland|64.14|-21.9|0
Male|Maldives|4.18|73.51|0
Thimphu|Bhutan|27.47|89.64|1
Bridgetown|Barbados|13.11|-59.62|1
Nouméa|New Caledonia|-22.27|166.45|1
Fort-de-France|Martinique|14.6|-61.07|1
Suva|Fiji|-18.14|178.43|1
Luxembourg|Luxembourg|49.61|6.13|1
Mbabane|Eswatini|-26.32|31.13|1
Moroni|Comoros|-11.7|43.26|1
Gitega|Burundi|-3.43|29.92|1
Bandar Seri Begawan|Brunei|4.89|114.94|1
Cayenne|French Guiana|4.94|-52.33|1
Kuwait City|Kuwait|29.37|47.97|1
Honiara|Solomon Islands|-9.43|159.95|1
Mamoudzou|Mayotte|-12.78|45.23|1
São Tomé|Sao Tome and Principe|0.34|6.73|1
Saint John’s|Antigua and Barbuda|17.12|-61.84|1
`;
