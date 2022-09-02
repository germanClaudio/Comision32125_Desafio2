const fs = require("fs");

class Container {
         constructor(filePath) {
            this.filePath = filePath;
         }

         async #readFile() {
            try {
                const content = await fs.promises.readFile(this.filePath, "utf-8");
                const contentParsed = JSON.parse(content)
                return contentParsed
                
            } catch (error) {
                console.error('Error leer archivo: ' + error)
            }    
         }

         async save(obj) {
            const FileContent = await this.#readFile()

            if ( FileContent.length !== 0 ) {
                try {
                    await fs.promises.writeFile(this.filePath, JSON.stringify([...FileContent, {...obj, id: FileContent[FileContent.length - 1].id + 1}], null, 2) )
                    console.log('Producto guardado con exito en Base de Datos!')
                } catch (error) {
                    console.log('Error al escribir en archivo!! \n' + error)
                }
            } else {
                try {
                    await fs.promises.writeFile(this.filePath, JSON.stringify([ {...obj, id: 1}]), 'utf-8')
                    console.log('Producto guardado con exito en Base de Datos!')
                } catch (error) {
                    console.log('Error al escribir en archivo!! \n' + error)
                }
            }
         }

         async getById(id) {
            const FileContent = await this.#readFile()
                
                const product = FileContent.filter(item => item.id === id)
                    if (product.length > 0) {
                        console.log('Producto encontrado: ' + JSON.stringify(product, true, 2));
                    } else {
                        console.log('Lo sentimos, el id del producto ingresado no existe en nuestra Base de Datos')
                    }
         }

         async getAll() {
            const FileContent = await this.#readFile()
            console.log(FileContent)
         }

         async deleteById(id) {
            const FileContent = await this.#readFile()
            
            const nonDeletedProducts = FileContent.filter(item => item.id !== id)
            const productToBeDeleted = FileContent.filter(item => item.id === id)
            
                if ( productToBeDeleted.length > 0) {
                    try {
                        await fs.promises.writeFile(this.filePath, JSON.stringify(nonDeletedProducts, null, 2));
                        console.log(`Producto ${JSON.stringify(productToBeDeleted, null, 2)} \nEliminado con exito de la Base de Datos!!\n`)
                    } catch (error) {
                        console.log('Error al escribir en archivo!! \n' + error)
                    }
                } else {
                    console.log('Lo sentimos, el id del producto ingresado no existe en nuestra Base de Datos')
                }
        }

         async deleteAll() {
            const FileContent = await this.#readFile()

            if( FileContent.length > 0 ) {
                try {
                    await fs.promises.writeFile(this.filePath, JSON.stringify([], null, 2), 'utf-8')
                    console.log('Todos los productos han sido Eliminados de la Base de Datos!!!')
                } catch (error) {
                    console.log('Error al escribir en archivo!! \n' + error)
                }
            } else {
                console.log('La Base de Datos está vacía!!!')
            }

         }
}         

const container = new Container('./productos.txt')

/* --- PARA PROBAR LOS MODULOS, DESCOMENTAR LAS LINEAS 94, 96, 98, 100 O 102 ---*/

//container.save({title: "Perfume Scandalete", price: 10500, thumbnail: "https://media.glamour.es/photos/616f93e77a09840b79f4bd0a/master/w_2953,h_4134,c_limit/619390.jpg"})

container.getAll()

//container.getById(4)

//container.deleteById(3)

//container.deleteAll()

