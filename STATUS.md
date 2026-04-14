# STATUS

## Vad projektet är

Projektet är en React- och TypeScript-baserad dashboard för att läsa, filtrera och presentera tasting-rapporter. Syftet är att ge en admin möjlighet att:

- läsa in rapportdata
- filtrera innehållet
- välja exakt vilka fält som ska visas i en rapport
- generera en delbar rapportvy för intressenter

Just nu används en lokal `.xlsx`-fil som dummy-data. MVP-tanken är att lösningen ska vara snygg nog att visa för beställaren innan vi tar beslut om backend, datakälla och eventuell vidare produktisering.

## Vad vi har gjort

- Satt upp projektet enligt SoC-principer.
- Flyttat state till contexts, främst för data och rapportinställningar.
- Delat upp UI i små komponenter med separata mappar och lokal CSS.
- Byggt en admin-dashboard med KPI-kort, filterpanel, rapportfältsval, delningsbar rapportlänk, rapportförhandsvisning och tabellvy.
- Byggt en publik rapportvy via separat route.
- Lagt till grafik och mer presentabel rapportdesign för MVP-visning.
- Säkrat att textfiler i projektet hanteras som UTF-8.
- Förbättrat layouten så att sidan inte växer i sidled på grund av långa länkar eller många valda fält.
- Kortat den visade länken i UI med `...`, samtidigt som full länk fortfarande används vid kopiering.
- Lagt till `Återställ val`, `Återställ filter`, `Välj alla` och `Rensa urval`.
- Lagt in beställarens logga i både admin-vy och rapportvy.
- Skärpt den visuella riktningen i dashboarden med mindre border-radius, stramare spacing och mörkare, mer kontraststark grafisk ton.
- Gjort om adminsektionen så att `Live Snapshot`, `Volym`, `Bäst hittills` och `Trend` har tydligare roller och rimligare bredd.
- Förbättrat trendgrafen så att den använder linjediagram när flera datapunkter finns och en kompakt jämförelsevy när bara en datapunkt finns.
- Tunnat ut linjerna i trendgrafen för ett mer stilrent uttryck.
- Initierat git-repo och skapat första committen för MVP-grunden.

## Vad som är nästa steg

## Kortsiktigt

- Finputsning av UI inför presentation för beställaren.
- Säkerställa att alla vyer känns konsekventa och tydliga vid verklig demo.
- Eventuellt justera vilka standardfält som är valda i rapporten.
- Eventuellt förbättra rapporttabellen ytterligare om mycket data ska visas samtidigt.
- Fortsätta skärpa den visuella hierarkin så att appen känns stilren, professionell och samtidigt lite flashig.

## Medelsiktigt

- Ta beslut om datakälla efter feedback från beställaren.
- Vid behov koppla appen till Google Form / Google Sheet för att hämta verklig data i MVP.
- Bedöma om det behövs en riktig kortlänkslösning med backend eller lagring.
- Påbörja PDF-export från samma rapportstruktur som redan används i appen.

## Senare

- Eventuell backend
- riktig kortlänksfunktion
- autentisering / adminhantering
- eget formulärflöde
- datalagring utanför Google-ekosystemet

## Reflektioner från dig

- Det är viktigt att MVP:n blir snygg och presentabel först.
- Vi ska inte väva in Google Sheets för hårt i arkitekturen redan nu.
- Google Form + Google Sheet kan vara tillräckligt för MVP, men är inte nödvändigtvis den långsiktiga lösningen.
- En egen formulärsida i appen är en tänkbar riktning, men just nu känns det för omständligt för MVP.
- Uttrycket ska vara stilrent och snyggt, men samtidigt lite flashigt och coolt.
- Fokus just nu är därför att få ordning på appen med dummy-data, skapa en tydlig och säljbar demo och ta vidare tekniska beslut först efter att beställaren har sett konceptet.

## Dynamisk länk

- Målet är att den delbara länken på sikt ska vara max 8 tecken efter domänen.
- Det är tekniskt möjligt med 8 tecken, men inte som en riktig delbar lösning enbart i frontend.
- En så kort länk kan inte bära hela rapportkonfigurationen i URL:en, utan måste fungera som en nyckel som slår upp sparad rapportdata.
- För att det ska fungera mellan olika användare behövs därför delad lagring, till exempel backend, serverless-funktion eller extern datatjänst.
- `localStorage` räcker bara för lokal demo i samma browser och är inte en riktig delningslösning.
- En lokal prototyp är nu testad i appen: rapporturval kan sparas bakom en kort kod i stil med `GetTogether`-projektets publika länkupplägg, men utan PIN.
- Den varianten fungerar bara i samma browserprofil eftersom uppslagningen idag ligger i `localStorage`.
- När vi vill göra lösningen verkligt delbar behöver samma kodslagning flyttas till gemensam lagring, inte byggas om från grunden.
- Slutsats: kodlängden är inte hindret, utan behovet av en gemensam uppslagningstjänst för rapportkonfigurationen.

## Öppen fråga framåt

Behöver MVP:n visa:

- endast dashboard + rapportvisning
- även ett enkelt formulärflöde i appen

Detta avgörs lämpligen efter första presentationen för beställaren.
