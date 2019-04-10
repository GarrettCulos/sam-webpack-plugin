import { SamWebpackPlugin } from './index';

describe('sanity checks', () => {
  it('export is valid class', () => {
    expect(typeof SamWebpackPlugin).toEqual('class');
  });
});

describe('constructor defines variables and throws errors', () => {
  it("plugin constructor defines regex's", () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './testing.yml' });
    expect(SamPlugin.declarationRegex).toBeDefined();
    expect(SamPlugin.declarationRegex).toEqual(/(?<=@WebpackLambda\()([^\)]+)(?=(\)))/g);
  });

  it('plugin constructor defines deployFolder', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './testing.yml' });
    expect(SamPlugin.deploymentFolder).toBeDefined();
    expect(SamPlugin.deploymentFolder).toEqual('./lambda-sam-deploy');

    const SamPlugin2 = new SamWebpackPlugin({ output: 'new-output', baseTemplate: './testing.yml' });
    expect(SamPlugin2.deploymentFolder).toEqual('new-output');
    // TODO figure out how to test error handling
    // expect(new SamWebpackPlugin({ output: <string>23423, baseTemplate: './testing.yml' })).toThrowError(
    //   '[SamWEepackPlugin]: options.output must be of type String'
    // );
  });

  it('plugin constructor defines options', () => {
    const SamPlugin = new SamWebpackPlugin({ baseTemplate: './testing.yml' });
    expect(SamPlugin.deploymentFolder).toBeDefined();
    expect(SamPlugin.deploymentFolder).toEqual('./lambda-sam-deploy');

    const SamPlugin2 = new SamWebpackPlugin({ output: 'newoutput', baseTemplate: './testing.yml' });
    expect(SamPlugin2.options).toBeDefined();
    expect(SamPlugin.options.verbose).toBeDefined();
    expect(SamPlugin.options.verbose).toEqual('');
  });
});

describe('parseLambdaDeclaration', () => {
  it('parseLambdaDeclaration should be defined');
  it("parseLambdaDeclaration should return when string doesn't contain @lambdaDeclaration", () => {});
  it('parseLambdaDeclaration should parse string to json when it contains @lambdaDeclaration', () => {});
  it('parseLambdaDeclaration should throw error when content is not a json', () => {});
});

describe('logDependencies', () => {
  it('logDependencies should be defined', () => {});
  it('logDependencies should return string of dependencies', () => {});
});

describe('apply method', () => {
  it('apply method should be define', () => {});
  it('apply method should be define', () => {});
});
