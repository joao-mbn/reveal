const execSync = require('child_process').execSync;

const runCmd = (cmd) => {
  execSync(cmd,
    {
      stdio: [0, 1, 2]
    }
  );
}

const target = process.argv[2];
const jobIndex = Number(process.argv[3]);
const jobCount = Number(process.argv[4]);
const baseSha = process.argv[5];
const headSha = process.argv[6];
const codecovToken = process.argv[7];

const parseNxTargetString = (input) => {
  return JSON.parse(input)
    .tasks.map((t) => ({ project: t.target.project, outputs: t.outputs }))
    .slice()
    .sort();
}

const affectedProjects = parseNxTargetString(
  execSync(`npx nx print-affected --target=${target} --base=${baseSha} --head=${headSha}`).toString('utf-8')
)

const main = () => {
  const sliceSize = Math.max(Math.floor(affectedProjects.length / jobCount), 1);

  const projects =
    jobIndex < jobCount
      ? affectedProjects.slice(sliceSize * (jobIndex - 1), sliceSize * jobIndex)
      : affectedProjects.slice(sliceSize * (jobIndex - 1));

  if (projects.length > 0) {
    const projectNames = projects.map(({ project }) => project)

    if (target === 'test') {
      runCmd(`yarn test ${projectNames}`);

      projects.forEach(({ project, outputs }) => {
        const basePath = outputs[0];
        const files = `${basePath}/coverage-final.json,${basePath}/cobertura-coverage.xml`;

        console.log(`Uploading codecov for ${project} (path: ${basePath})`);

        // Upload codecov with specific flags, see: https://docs.codecov.com/docs/flags
        runCmd(`./bin/codecov-linux -F ${project} -f ${files} -t ${codecovToken}`);
      });
    } else {
      runCmd(
        `npx nx run-many --configuration=production --target=${target} --projects=${projectNames} --parallel`
      );
    }
  }
}

main()