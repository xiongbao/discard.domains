import Link from "@/components/Link";
import Arrow from "@/components/Arrow";
import * as Collapsible from "@radix-ui/react-collapsible";
import { google } from "googleapis";
import React from "react";

export async function getStaticProps() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      private_key: privateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:O",
  });

  const rows = [];
  const rawRows = res.data.values || [];
  const headers = rawRows.shift();

  rawRows.forEach((row) => {
    const rowData = {};
    row.forEach((item, index) => {
      rowData[headers[index]] = item;
    });
    rows.push(rowData);
  });

  const parks = rows;

  return {
    props: {
      parks,
    },
    revalidate: 10,
  };
}

export default function Home({ parks }) {
  const ParkRow = (props) => {
    const {
      Domain,
      Registrar,
      RegistrarUrl,
      Creation,
      Expiry,
      RenewFee,
      AuthCode,
      Owner,
      OwnerUrl,
      OwnerEmail,
      Description,
      ID,
    } = props;

    return (
      <Collapsible.Root
        className="transition group hover:bg-sally/10"
      >
        <div className="w-full grid text-left py-2.5 px-4 grid-cols-yeah">
          <h2>
            <Link
              href={`https://tian.hu/${Domain}`}
              isExternal
              className="underline transition hover:bg-sally/50 underline-offset-4"
            >{Domain}</Link>
          </h2>
          <div>{Creation}</div>
          <div>{Expiry}</div>
          <div>
            <Link
              href={`https://${RegistrarUrl}`}
              isExternal
              className="underline transition hover:bg-sally/50 underline-offset-4"
            >{Registrar}</Link>
          </div>
          <div>{RenewFee}</div>
          <Collapsible.Trigger>
            <div className="ml-auto transition-transform duration-300 group-data-[state='open']:rotate-90 place-self-center">
              <Arrow />
            </div>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content className="overflow-hidden data-[state=open]:open data-[state=closed]:close">
          <div className="grid px-4 overflow-hidden grid-cols-yeah">
            <div className="flex flex-col col-span-2 pl-12 ml-1.5 gap-y-6 pb-6 pt-3">
              <h3>from&nbsp;
                {OwnerUrl ? (
                  <Link
                    href={OwnerUrl}
                    isExternal
                    className="underline transition hover:bg-sally/50 underline-offset-4"
                  >
                    {Owner}
                  </Link>
                ) : (
                  <span>{Owner}</span>
                )}
                <span>{OwnerUrl ? (
                  <Link
                    href={`mailto:${OwnerEmail}`}
                    isExternal
                    className="transition text-black/50 hover:text-sally"
                  >
                    ({OwnerEmail})
                  </Link>
                ) : ''}</span>
              </h3>
              <p>{Description}</p>
              <div>
                <h3 className="text-sm mb-1.5">转移码</h3>
                <p>{AuthCode}</p>
              </div>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    );
  };

  return (
    <main className="w-full h-full">
      <div className="">
        <div className="text-xl border-b-2 border-mcqueen">
          <ul className="grid w-full px-4 grid-cols-yeah">
            <li className="pl-12 ml-1.5">Domain Name</li>
            <li>Creation Date</li>
            <li>Expiry Date</li>
            <li>Registrar</li>
            <li>Renew Fee</li>
          </ul>
        </div>
        <div className="grid isolate">
          <div className="z-10 border-b divide-y border-mcqueen divide-mcqueen park overlay">
            {parks.map((park) => (
              <ParkRow key={park.ID} {...park} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
