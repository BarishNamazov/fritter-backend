import type {Request, Response, NextFunction} from 'express';
import validator from 'validator';

const isValidEntries = (req: Request, res: Response, next: NextFunction) => {
  const nameSet = new Set<string>();
  for (const {name, url} of (req.body.entries as Array<{name: string; url: string}>)) {
    if (!(/^[a-zA-Z0-9 ]+$/.test(name))) {
      res.status(400).json({
        error: `Entry names should be non-empty and consist of letters, digits, and spaces: entry with name "${name}" breaks this rule.`
      });
      return;
    }

    if (!validator.isURL(url)) {
      res.status(400).json({
        error: `All URLs (links) must be valid: entry with name "${name}" and URL (link) "${url}" breaks this rule.`
      });
      return;
    }

    if (nameSet.has(name)) {
      res.status(400).json({
        error: `All entries must be named differently: "${name}" exists twice.`
      });
      return;
    }

    nameSet.add(name);
  }

  next();
};

export {
  isValidEntries
};
