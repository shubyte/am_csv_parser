const LineByLineReader = require("linebyline");

if (process.argv.length < 3) {
  console.error("Usage: node parseCsv.js <path_to_csv_file>");
  process.exit(1);
}

const csvFilePath = process.argv[2];
const lr = new LineByLineReader(csvFilePath);

const stationStats = {};

// each line in CSV file
lr.on("line", (line) => {
  const columns = line.split(";");
  const city = columns[0];
  if (!city) return;

  let min = Infinity,
    max = -Infinity,
    sum = 0,
    count = 0;

  for (let i = 1; i < columns.length; i++) {
    const num = +columns[i];
    if (!isNaN(num)) {
      min = Math.min(min, num);
      max = Math.max(max, num);
      sum += num;
      count++;
    }
  }

  if (count > 0) {
    const cityStats =
      stationStats[city] ||
      (stationStats[city] = {
        min: Infinity,
        max: -Infinity,
        sum: 0,
        count: 0,
      });
    cityStats.min = Math.min(cityStats.min, min);
    cityStats.max = Math.max(cityStats.max, max);
    cityStats.sum += sum;
    cityStats.count += count;
  }
});

// output the results
lr.on("end", () => {
  const result = {};
  for (const city in stationStats) {
    const { min, max, sum, count } = stationStats[city];
    result[city] = `${min}/${max}/${(sum / count).toFixed(2)}`;
  }

  const sortedResult = Object.keys(result)
    .sort()
    .reduce((acc, city) => {
      acc[city] = result[city];
      return acc;
    }, {});

  console.log(sortedResult);
});
