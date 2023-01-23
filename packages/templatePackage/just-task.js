const {
    task,
    cleanTask,
    jestTask,
    tscTask,
    series
} =  require('just-scripts');


task('jest', jestTask());
task('ts', series(tscTask({ build: 'tsconfig.json' })));

task('clean', cleanTask(['bin', 'dist', 'lib']));
task('build', series('ts'));
task('test', series('jest'));
task('start', () => require('./lib').main());
