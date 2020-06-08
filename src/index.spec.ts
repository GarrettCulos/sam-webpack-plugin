import { SamWebpackPlugin } from './index';
import testPackageLock from './test1.package-lock.json';

describe('sanity checks', () => {
  it('export is valid class', () => {
    const classTest = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    expect(classTest instanceof SamWebpackPlugin).toBeTruthy();
  });
});

describe('constructor defines variables and throws errors', () => {
  it("plugin constructor defines regex's", () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin.declarationRegex).toBeDefined();
    expect(SamPlugin.declarationRegex).toEqual(/(?<=@WebpackLambda\()([^\)]+)(?=(\)))/g);
  });

  it('plugin constructor defines deployFolder', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin.deploymentFolder).toBeDefined();
    expect(SamPlugin.deploymentFolder).toEqual('./lambda-sam-deploy');

    const SamPlugin2 = new SamWebpackPlugin({ output: 'new-output', baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin2.deploymentFolder).toEqual('new-output');
    // TODO figure out how to test error handling
    // expect(new SamWebpackPlugin({ output: <string>23423, baseTemplate: './testing.json' })).toThrowError(
    //   '[SamWEepackPlugin]: options.output must be of type String'
    // );
  });

  it('plugin constructor defines options.verbose', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin.options).toBeDefined();
    expect(SamPlugin.options.verbose).toBeDefined();
    expect(SamPlugin.options.verbose).toBeFalsy();

    const SamPlugin2 = new SamWebpackPlugin({ verbose: true, baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin2.options).toBeDefined();
    expect(SamPlugin2.options.verbose).toBeDefined();
    expect(SamPlugin2.options.verbose).toBeTruthy();
  });

  it('plugin constructor defines options.requireText', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin.options).toBeDefined();
    expect(SamPlugin.options.requireTxt).toBeDefined();
    expect(SamPlugin.options.requireTxt).toBeFalsy();

    const SamPlugin2 = new SamWebpackPlugin({ requireTxt: true, baseTemplate: './test/data/testingConfig.json' });
    expect(SamPlugin2.options).toBeDefined();
    expect(SamPlugin2.options.requireTxt).toBeDefined();
    expect(SamPlugin2.options.requireTxt).toBeTruthy();
  });
  it('plugin constructor should save layers options', () => {});
});

describe('parseLambdaDeclaration', () => {
  it('parseLambdaDeclaration should be defined', () => {});
  it("parseLambdaDeclaration should return when string doesn't contain @lambdaDeclaration", () => {});
  it('parseLambdaDeclaration should parse string to json when it contains @lambdaDeclaration', () => {});
  it('parseLambdaDeclaration should throw error when content is not a json', () => {});
});

describe('logDependencies', () => {
  it('logDependencies should be defined', () => {});
  it('logDependencies should return string of dependencies', () => {});
});

describe('getDependencies', () => {
  it('handles requires with non dependency requires (like ws -> async-limiter)', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './test/data/testingConfig.json' });
    const depsArray = SamPlugin.recursiveGetDepsRequires(testPackageLock.dependencies);
    expect(depsArray.includes('ws')).toBeTruthy();
    expect(depsArray.includes('async-limiter')).toBeTruthy();
  });
});

describe('apply method', () => {
  it('apply method should be define', () => {});
  it('apply method should be define', () => {});
});
