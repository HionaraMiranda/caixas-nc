odutos = [];// =========================
// BANCO LOCAL
// =========================

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let latonados =
JSON.parse(
localStorage.getItem("latonados")
) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    {
        usuario: "admin",
        senha: "123456"
    }
];

// =========================
// NAVEGAÇÃO
// =========================

function mostrarTela(id) {

    if(
        id === "usuarios" &&
        localStorage.getItem("perfil") !== "admin"
    ){

        alert(
        "Somente o administrador pode acessar."
        );

        return;
    }

    document
    .querySelectorAll(".pagina")
    .forEach(p => {

        p.classList.add("oculto");

    });

    const tela =
    document.getElementById(id);

    if(!tela){

        console.log(
        "Tela não encontrada:",
        id
        );

        return;
    }

    tela.classList.remove("oculto");

}

// =========================
// LOGIN
// =========================

function login() {

    let usuario = document.getElementById("loginUsuario").value;
    let senha = document.getElementById("loginSenha").value;

    let valido = usuarios.find(u =>
        u.usuario === usuario &&
        u.senha === senha
    );

    if (!valido) {
        alert("Usuário ou senha incorretos");
        return;
    }

    localStorage.setItem("usuarioLogado", usuario);
    if(usuario === "admin"){

    localStorage.setItem(
    "perfil",
    "admin"
    );

}else{

    localStorage.setItem(
    "perfil",
    "usuario"
    );

}

    mostrarTela("dashboard");

    atualizarDashboard();
    carregarTabela();
    listarUsuarios();

    alert("Login realizado com sucesso.");
}

// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem("usuarioLogado");

    mostrarTela("login");
}

// =========================
// USUÁRIOS
// =========================

function criarUsuario() {

    let usuario = document.getElementById("novoUsuario").value;
    let senha = document.getElementById("novaSenha").value;

    if (usuario === "" || senha === "") {
        alert("Preencha usuário e senha.");
        return;
    }

    usuarios.push({
        usuario,
        senha
    });

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    listarUsuarios();

    alert("Usuário criado com sucesso.");
}

function listarUsuarios() {

    let lista = document.getElementById("listaUsuarios");

    if (!lista) return;

    lista.innerHTML = "";

    usuarios.forEach((u, index) => {

        lista.innerHTML += `
            <tr>
                <td>${u.usuario}</td>
                <td>
                    <button onclick="excluirUsuario(${index})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

function excluirUsuario(index) {

    if (!confirm("Excluir usuário?")) return;

    usuarios.splice(index, 1);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    listarUsuarios();
}

// =========================
// SALVAR PRODUTO
// =========================

async function salvarProduto() {

    let caixa = document.getElementById("caixa").value;

    if (caixa === "") {
        alert("Informe o número da caixa.");
        return;
    }

    let existe = produtos.find(
        p => p.caixa === caixa
    );

    if (existe) {

        alert("Esta caixa já foi cadastrada.");

        return;
    }

    let produto = {

        caixa: caixa,

        descricao:
            document.getElementById("descricao").value,

        bobina:
            document.getElementById("bobina").value,

        categoria:
            document.getElementById("categoria").value,

        peso:
            document.getElementById("peso").value,

        usuario:
            localStorage.getItem("usuarioLogado"),

        localizacao:
            document.getElementById("localizacao").value,

        observacao:
            document.getElementById("observacao").value,

        dataCadastro:
            new Date().toLocaleString(),

        alteradoPor: "",

        dataAlteracao: ""

    };

   produtos.push(produto);

   console.log(produto);

await window.addDoc(
    window.collection(
        window.db,
        "caixas"
    ),
    {
        caixa: produto.caixa,
        descricao: produto.descricao,
        bobina: produto.bobina,
        categoria: produto.categoria,
        peso: produto.peso,
        usuario: produto.usuario,
        localizacao: produto.localizacao,
        observacao: produto.observacao,
        dataCadastro: produto.dataCadastro,
        alteradoPor: produto.alteradoPor,
        dataAlteracao: produto.dataAlteracao
    }
);

salvarBanco();

limparFormulario();

alert("Produto cadastrado com sucesso.");
}

// =========================
// LIMPAR FORM
// =========================

function limparFormulario() {

    document.getElementById("caixa").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("localizacao").value = "";
    document.getElementById("observacao").value = "";
}

// =========================
// SALVA BANCO
// =========================

function salvarBanco() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

    carregarTabela();
    carregarTabelaEditar();
    atualizarDashboard();
}

// =========================
// TABELA VISUALIZAÇÃO
// =========================

function carregarTabela() {

    let tabela =
        document.getElementById("tabelaProdutos");

    if (!tabela) return;

    tabela.innerHTML = "";

    produtos.forEach((produto,index) => {

    tabela.innerHTML += `

    <tr>

        <td>${produto.caixa}</td>

        <td>${produto.descricao}</td>

        <td>${produto.bobina}</td>

        <td>${produto.categoria}</td>

        <td>${produto.peso}</td>

        <td>${produto.usuario}</td>

        <td>${produto.localizacao}</td>

        <td>${produto.observacao || ""}</td>

        <td>${produto.usuario || ""}</td>

        <td>${produto.dataCadastro || ""}</td>

        <td>${produto.alteradoPor || ""}</td>

        <td>${produto.dataAlteracao || ""}</td>

        <td>

            <button
            class="btn-editar"
            onclick="editarProduto(${index})">
            ✏️
            </button>

            <button
            class="btn-excluir"
            onclick="excluirProduto(${index})">
            🗑️
            </button>

        </td>

    </tr>

    `;

});}
 

// =========================
// FILTROS
// =========================

  function filtrarProdutos() {

    let caixa =
        document.getElementById("filtroCaixa").value.toLowerCase();

    let descricao =
        document.getElementById("filtroDescricao").value.toLowerCase();

    let categoria =
        document.getElementById("filtroCategoria").value;

    let tabela =
        document.getElementById("tabelaProdutos");

    tabela.innerHTML = "";

    produtos.filter(produto => {

        let okCaixa =
            String(produto.caixa || "")
            .toLowerCase()
            .includes(caixa);

        let okDescricao =
            String(produto.descricao || "")
            .toLowerCase()
            .includes(descricao);

        let okCategoria =
            categoria === "" ||
            String(produto.categoria || "")
            .trim()
            .toUpperCase() ===
            categoria
            .trim()
            .toUpperCase();

        return okCaixa &&
               okDescricao &&
               okCategoria;

    })
    .forEach(produto => {

        tabela.innerHTML += `

        <tr>
            <td>${produto.caixa}</td>
            <td>${produto.descricao}</td>
            <td>${produto.bobina}</td>
            <td>${produto.categoria}</td>
            <td>${produto.peso}</td>
            <td>${produto.usuario}</td>
            <td>${produto.localizacao}</td>
            <td>${produto.observacao || ""}</td>
        </tr>

        `;

    });

}
console.log(produtos);

// =========================
// TELA MODIFICAR
// =========================

function carregarTabelaEditar() {

    let tabela =
        document.getElementById("tabelaEditar");

    if (!tabela) return;

    tabela.innerHTML = "";

    produtos.forEach((produto, index) => {

        tabela.innerHTML += `

        <tr>

            <td>${produto.caixa}</td>

            <td>${produto.descricao}</td>

            <td>${produto.categoria}</td>

            <td>

                <button onclick="editarProduto(${index})">

                    Editar

                </button>

                <button onclick="excluirProduto(${index})">

                    Excluir

                </button>

            </td>

        </tr>

        `;
    });
}

// =========================
// EDITAR
// =========================

function editarProduto(index){

    document.getElementById(
    "idxEditar"
    ).value = index;

    document.getElementById(
    "editarDescricao"
    ).value =
    produtos[index].descricao;

    document.getElementById(
    "editarBobina"
    ).value =
    produtos[index].bobina;

    document.getElementById(
    "editarCategoria"
    ).value =
    produtos[index].categoria;

    document.getElementById(
    "editarPeso"
    ).value =
    produtos[index].peso;

    document.getElementById(
    "editarLocalizacao"
    ).value =
    produtos[index].localizacao;

    document.getElementById(
    "editarObservacao"
    ).value =
    produtos[index].observacao || "";

    mostrarTela(
    "editarCaixa"
    );

}
// =========================
// EXCLUIR
// =========================

function excluirProduto(index) {

    if (!confirm("Deseja excluir o produto?"))
        return;

    produtos.splice(index, 1);

    salvarBanco();
}

// =========================
// EXPORTAR EXCEL
// =========================

function exportarExcel() {

    let ws =
        XLSX.utils.json_to_sheet(produtos);

    let wb =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Produtos"
    );

    XLSX.writeFile(
        wb,
        "Belgo_Produtos.xlsx"
    );
}

// =========================
// IMPORTAR EXCEL
// =========================
function importarExcel(event) {

    const arquivo = event.target.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
            type: "array"
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const dadosExcel = XLSX.utils.sheet_to_json(sheet);

        dadosExcel.forEach(linha => {

            produtos.push({

                caixa: linha["Número da caixa"] || "",

                descricao: linha["Descrição"] || "",

                bobina: linha["TIPO DE BOBINA"] || "",

                categoria: linha["CAIXA DE"] || "",

                peso: linha["Peso (kg)"] || 0,

                usuario: linha["Usuário"] || "",

                localizacao: linha["Localização"] || "",

                observacao: "",

                dataCadastro: new Date().toLocaleString(),

                alteradoPor: "",

                dataAlteracao: ""

            });

        });

        salvarBanco();

        alert(
            dadosExcel.length +
            " produtos importados com sucesso."
        );

    };

    reader.readAsArrayBuffer(arquivo);
}
console.log(produtos);

// =========================
// DASHBOARD
// =========================

function atualizarDashboard() {

    if (document.getElementById("totalProdutos"))
        document.getElementById("totalProdutos").innerText =
            produtos.length;

    if (document.getElementById("totalSucata"))
        document.getElementById("totalSucata").innerText =
            produtos.filter(p =>
                p.categoria === "SUCATA A PARTE"
            ).length;

    if (document.getElementById("totalRecuperacao"))
        document.getElementById("totalRecuperacao").innerText =
            produtos.filter(p =>
                p.categoria === "RECUPERAÇÃO"
            ).length;

    if (document.getElementById("totalNaoIdentificado"))
        document.getElementById("totalNaoIdentificado").innerText =
            produtos.filter(p =>
                p.categoria === "NÃO IDENTIFICADO"
            ).length;

    if (document.getElementById("pesoTotal"))
        document.getElementById("pesoTotal").innerText =
            produtos.reduce(
                (soma, p) =>
                    soma + Number(p.peso || 0),
                0
            );
}
criarGrafico();

// =========================
// INICIALIZAÇÃO
// =========================


carregarCaixasFirebase();;

listarUsuarios();

carregarLatonadosFirebase();

function criarGrafico() {

    const canvas = document.getElementById("graficoCategoria");

    if (!canvas) return;

    if (window.graficoBelgo) {
        window.graficoBelgo.destroy();
    }

    const sucata = produtos.filter(
        p => p.categoria === "SUCATA A PARTE"
    ).length;

    const recuperacao = produtos.filter(
        p => p.categoria === "RECUPERAÇÃO"
    ).length;

    const naoIdentificado = produtos.filter(
        p => p.categoria === "NÃO IDENTIFICADO"
    ).length;

    window.graficoBelgo = new Chart(canvas, {

        type: "doughnut",

        data: {
            labels: [
                "Sucata",
                "Recuperação",
                "Não Identificado"
            ],

            datasets: [{
                data: [
                    sucata,
                    recuperacao,
                    naoIdentificado
                ],

                backgroundColor: [
                    "#F47721",
                    "#008F6B",
                    "#9CA3AF"
                ]
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });

}
document
.getElementById("localizacaoLatonado")
.addEventListener("change", function(){

    if(this.value === "NA MAQUINA"){

        document.getElementById(
        "linhaLatonado"
        ).style.display = "block";

        document.getElementById(
        "maquinaLatonado"
        ).style.display = "block";

    }else{

        document.getElementById(
        "linhaLatonado"
        ).style.display = "none";

        document.getElementById(
        "maquinaLatonado"
        ).style.display = "none";

    }

});

document
.getElementById("descricaoLatonado")
.addEventListener("change", function(){

    if(this.value === "OUTRO"){

        document.getElementById(
        "novoMaterial"
        ).style.display = "block";

    }else{

        document.getElementById(
        "novoMaterial"
        ).style.display = "none";

    }

});

async function salvarLatonado(){

let etiqueta =
document.getElementById(
"etiquetaLatonado"
).value;

if(
latonados.some(
x=>x.etiqueta===etiqueta
)
){

alert(
"Etiqueta já cadastrada."
);

return;

}

let descricao =
document.getElementById(
"descricaoLatonado"
).value;

if(descricao==="OUTRO"){

descricao =
document.getElementById(
"novoMaterial"
).value;

}

let registro = {

etiqueta: etiqueta,

descricao: descricao,

situacao:
document.getElementById(
"situacaoLatonado"
).value,

tipoBobina:
document.getElementById(
"tipoBobinaLatonado"
).value,

quantidade:
document.getElementById(
"quantidadeLatonado"
).value,

localizacao:
document.getElementById(
"localizacaoLatonado"
).value,

linha:
document.getElementById(
"linhaLatonado"
).value,

maquina:
document.getElementById(
"maquinaLatonado"
).value,

cadastradoPor:
localStorage.getItem(
"usuarioLogado"
),

dataCadastro:
new Date().toLocaleString(),

alteradoPor:"",
dataAlteracao:""

};

latonados.push(registro);

await window.addDoc(
    window.collection(
        window.db,
        "latonados"
    ),
    registro
);

localStorage.setItem(
"latonados",
JSON.stringify(latonados)
);

listarLatonados();

dashboardLatonados();

alert(
"Bobina cadastrada com sucesso."
);


}
function listarLatonados(){

    let filtro =
    document.getElementById(
    "filtroEtiqueta"
    )?.value.toLowerCase() || "";

    let tabela =
    document.getElementById(
    "tabelaLatonados"
    );

    if(!tabela) return;

    tabela.innerHTML = "";

    latonados
    .filter(x =>
        String(x.etiqueta)
        .toLowerCase()
        .includes(filtro)
    )
    .forEach((item,index)=>{

        tabela.innerHTML += `

        <tr>

        <td>${item.etiqueta}</td>
        <td>${item.descricao}</td>
        <td>${item.situacao}</td>
        <td>${item.tipoBobina}</td>
        <td>${item.quantidade}</td>
        <td>${item.localizacao}</td>
        <td>${item.cadastradoPor}</td>
        <td>${item.dataCadastro}</td>
        <td>${item.alteradoPor || ""}</td>
        <td>${item.dataAlteracao || ""}</td>

        <td>

        <button onclick="editarLatonado(${index})">
        ✏️
        </button>

        <button onclick="excluirLatonado(${index})">
        🗑️
        </button>

        </td>

        </tr>

        `;

    });

}

function dashboardLatonados(){

    const total =
    latonados.length;

    const ws550 =
    latonados.filter(
        x => x.tipoBobina === "WS550"
    ).length;

    const ws750 =
    latonados.filter(
        x => x.tipoBobina === "WS750"
    ).length;

   const parado =
latonados.filter(
    x => x.situacao === "PARADO"
).length;


    const aguardando =
    latonados.filter(
        x => x.situacao === "AGUARDANDO ANALISE"
    ).length;

    if(document.getElementById("totalLatonados")){
        document.getElementById("totalLatonados").innerText = total;
    }

    if(document.getElementById("totalWS550")){
        document.getElementById("totalWS550").innerText = ws550;
    }

    if(document.getElementById("totalWS750")){
        document.getElementById("totalWS750").innerText = ws750;
    }

    if(document.getElementById("totalParado")){
        document.getElementById("totalParado").innerText = parado;
    }

    if(document.getElementById("totalAguardando")){
        document.getElementById("totalAguardando").innerText = aguardando;
    }

}
function exportarLatonados(){

    let ws =
    XLSX.utils.json_to_sheet(
        latonados
    );

    let wb =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Latonados"
    );

    XLSX.writeFile(
        wb,
        "Controle_Latonados.xlsx"
    );

}

function editarLatonado(index){

    let novaSituacao = prompt(
        "Nova Situação:",
        latonados[index].situacao
    );

    if(novaSituacao === null){
        return;
    }

    latonados[index].situacao = novaSituacao;

    latonados[index].alteradoPor =
    localStorage.getItem("usuarioLogado");

    latonados[index].dataAlteracao =
    new Date().toLocaleString();

    localStorage.setItem(
        "latonados",
        JSON.stringify(latonados)
    );

    listarLatonados();

    dashboardLatonados();
}

function excluirLatonado(index){

    if(!confirm("Deseja excluir esta bobina?")){
        return;
    }

    latonados.splice(index,1);

    localStorage.setItem(
        "latonados",
        JSON.stringify(latonados)
    );

    listarLatonados();

    dashboardLatonados();
}
function salvarEdicaoCaixa(){

    let i =
    document.getElementById(
    "idxEditar"
    ).value;

    produtos[i].descricao =
    document.getElementById(
    "editarDescricao"
    ).value;

    produtos[i].bobina =
    document.getElementById(
    "editarBobina"
    ).value;

    produtos[i].categoria =
    document.getElementById(
    "editarCategoria"
    ).value;

    produtos[i].peso =
    document.getElementById(
    "editarPeso"
    ).value;

    produtos[i].localizacao =
    document.getElementById(
    "editarLocalizacao"
    ).value;

    produtos[i].observacao =
    document.getElementById(
    "editarObservacao"
    ).value;

    produtos[i].alteradoPor =
    localStorage.getItem(
    "usuarioLogado"
    );

    produtos[i].dataAlteracao =
    new Date().toLocaleString();

    salvarBanco();

    alert(
    "Caixa atualizada com sucesso."
    );

}
async function carregarCaixasFirebase(){

    try{

        const snapshot =
        await window.firebaseDB.getDocs(
            window.firebaseDB.collection(
                window.firebaseDB.db,
                "caixas"
            )
        );

        produtos = [];

        snapshot.forEach(doc => {

            produtos.push(
                doc.data()
            );

        });

        carregarTabela();

        carregarTabelaEditar();

        atualizarDashboard();

        console.log(
        "CAIXAS CARREGADAS DO FIREBASE"
        );

    }catch(erro){

        console.error(
        erro
        );

    }

}

async function carregarLatonadosFirebase(){

    try{

        const snapshot =
        await window.firebaseDB.getDocs(
            window.firebaseDB.collection(
                window.firebaseDB.db,
                "latonados"
            )
        );

        latonados = [];

        snapshot.forEach(doc => {

            latonados.push(
                doc.data()
            );

        });

        listarLatonados();

        dashboardLatonados();

        console.log(
        "LATONADOS CARREGADOS DO FIREBASE"
        );

    }catch(erro){

        console.error(
        erro
        );

    }

}