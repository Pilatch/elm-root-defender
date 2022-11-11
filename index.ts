import {
  Compilation,
  Compiler,
  AssetInfo,
  WebpackPluginInstance,
  sources,
} from "webpack";

type AssetName = string;
type SourceCodeString = string | Buffer;

class ElmRootDefender implements WebpackPluginInstance {
  private elmRootId: string;

  constructor(elmRootId: string) {
    this.elmRootId = elmRootId || "elm-root";
  }

  apply(compiler: Compiler) {
    const { Compilation } = compiler.webpack;

    compiler.hooks.thisCompilation.tap("ElmRootDefender", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "ElmRootDefender",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        this.updateAssets(compilation)
      );
    });
  }

  updateAssets = (compilation: Compilation) => (assets: AssetInfo) => {
    Object.keys(assets).forEach((asset) => {
      if (asset.endsWith(".js")) {
        const file = compilation.getAsset(asset);
        if (file) {
          this.updateAsset(compilation, asset, file.source.source());
        }
      }
    });
  };

  updateAsset(
    compilation: Compilation,
    asset: AssetName,
    sourceCode: SourceCodeString
  ) {
    compilation.updateAsset(
      asset,
      new sources.RawSource(this.replaceBodyWithRootId(sourceCode))
    );
  }

  replaceBodyWithRootId(sourceCode: SourceCodeString) {
    if (typeof sourceCode !== "string") {
      return sourceCode;
    }

    return sourceCode
      .replace(
        /var bodyNode = _VirtualDom_doc.body;/gi,
        `var bodyNode = _VirtualDom_doc.getElementById('${this.elmRootId}');`
      )
      .replace(
        /var nextNode = _VirtualDom_node\('body'\)\(_List_Nil\)\(doc\.([\w\$]+)\);/gi,
        (match, docBodyIdentifier) =>
          `var nextNode = _VirtualDom_node('div')(_List_Nil)(doc.${docBodyIdentifier})`
      );
  }
}

module.exports = ElmRootDefender;
