class ElmRootDefender {
    constructor(elmRootId) {
        this.elmRootId = elmRootId || 'elm-root'
    }

    apply(compiler) {
        let { Compilation, sources } = compiler.webpack
        compiler.hooks.thisCompilation.tap('ElmRootDefender', compilation => {
            compilation.hooks.processAssets.tap({
                name: 'ElmRootDefender',
                stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            }, this.updateAssets(compilation, sources))
        })
    }

    updateAssets = (compilation, sources) => assets => {
        Object.keys(assets).forEach(asset => {
            if (asset.endsWith('.js')) {
                let file = compilation.getAsset(asset)

                this.updateAsset(compilation, sources, asset, file.source.source())
            }
        })
    }

    updateAsset(compilation, sources, asset, sourceCode) {
        compilation.updateAsset(
            asset,
            new sources.RawSource(this.replaceBodyWithRootId(sourceCode))
        )
    }

    replaceBodyWithRootId(sourceCode) {
        if (typeof sourceCode.replace !== 'function') {
            return sourceCode
        }

        return sourceCode
            .replace(
                /var bodyNode = _VirtualDom_doc.body;/gi,
                `var bodyNode = _VirtualDom_doc.getElementById('${this.elmRootId}');`
            )
            .replace(
                /var nextNode = _VirtualDom_node\('body'\)\(_List_Nil\)\(doc\.(\w+)\);/gi,
                (match, docBodyIdentifier) => `var nextNode = _VirtualDom_node('div')(_List_Nil)(doc.${docBodyIdentifier})`
            )
    }
}

module.exports = ElmRootDefender
