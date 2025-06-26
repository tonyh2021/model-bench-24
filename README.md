This project is designed to [display rankings](https://tonyh2021.github.io/model-bench-24) for [CVPR 2024](https://www.codabench.org/competitions/1847/). Inspired by [PathBench](https://github.com/birkhoffkiki/PathBench).

## Data Preparation

The data is sourced from Excel documents in the script directory. After executing the command:

```
python scripts/excel_to_json.py AllData_rankings_with_ids.xls
```

It will generate `model.json` and `performance.json` files.
Move these files to `src/data`:

```
mv scripts/model.json scripts/performance.json src/data/
```

Also, modify the meta.ts file according to the competition information you want to display.

## Project Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. To build for production:

```bash
npm run build
# or
yarn build
```

5. To start the production server:

```bash
npm run start
# or
yarn start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
