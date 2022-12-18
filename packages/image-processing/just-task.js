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

task('image-to-monochrome', () => { require('./lib').imageToMonochromeTask(); });
task('image-to-binary', () => { require('./lib').imageToBinaryTask() });
task('image-to-binary-by-component', () => { require('./lib').imageToBinaryByComponentTask() });

task('quick-validation', () => { require('./lib').quickValidation()});