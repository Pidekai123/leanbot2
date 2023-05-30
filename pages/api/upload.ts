import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: async function(req, file, cb) {
    const dir = '/var/www/html/leanbot/leanbot2/docs';
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Check File Type
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Allowed ext
  const filetypes = /pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: PDFs Only!'));
  }
}

const upload = multer({ storage, fileFilter: checkFileType });

export const config = {
  api: {
    bodyParser: false
  }
};

export default function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const multerAny: any = multer({ storage });
    const uploadMiddleware = multerAny.single('file');
    uploadMiddleware(req, res, function(err: any) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // file uploaded successfully
      res.status(200).json({ message: 'File uploaded successfully!' });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
