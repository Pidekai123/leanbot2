import { NextApiRequest, NextApiResponse } from "next";
import { run } from "../../scripts/ingest-data";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await run();
      res.status(200).json({ message: 'Ingestion complete' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to run ingestion script', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Return 'Method Not Allowed' if not POST
  }
}
