CREATE TABLE Carga(
    ID_Pedido INT NOT NULL,
    ID_Produto INT NOT NULL,
    Pedido_data VARCHAR(10) NOT NULL,
    Pagamento_data VARCHAR(10) NOT NULL,
    UPC INT NOT NULL,
    SKU INT NOT NULL,
    Nome_Produto VARCHAR(30) NOT NULL,
    Quant INT NOT NULL,
    Moeda VARCHAR(15) NOT NULL,
    Tipo_Entrega VARCHAR(20) NOT NULL,
    Valor FLOAT NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Nome_Comprador VARCHAR(100) NOT NULL,
    Endereco1 VARCHAR(50) NOT NULL,
    Endereco2 VARCHAR(50),
    Endereco3 VARCHAR(50),
    CEP INT NOT NULL,
    Cidade VARCHAR(100) NOT NULL,
    UF VARCHAR(50) NOT NULL,
    PAIS VARCHAR(30) NOT NULL,
    Telefone VARCHAR(15) NOT NULL,
    CPF VARCHAR(11) NOT NULL
)
GO

-- Tabela de Clientes
CREATE TABLE Cliente (
    ID_Cliente INT IDENTITY(1,1) PRIMARY KEY,
    Nome VARCHAR(100),
    CPF VARCHAR(11),
    Email VARCHAR(100),
    Telefone VARCHAR(15)
)
GO

-- Tabela de Produtos
CREATE TABLE Produto (
    ID_Produto INT IDENTITY(1,1) PRIMARY KEY,
    SKU INT,
    Nome_Produto VARCHAR(100),
    Valor FLOAT,
    Estoque INT DEFAULT 0
)
GO

-- Tabela de Pedidos
CREATE TABLE Pedido (
    ID_Pedido INT PRIMARY KEY,
    Data_Pedido DATE,
    Pagamento_data DATE,
    Valor_Total FLOAT,
    Tipo_Entrega VARCHAR(50),
    Moeda VARCHAR(15),
    Endereco1 VARCHAR(50),
    Endereco2 VARCHAR(50),
    Endereco3 VARCHAR(50),
    CEP INT,
    Cidade VARCHAR(100),
    UF VARCHAR(50),
    PAIS VARCHAR(30),
    ID_Cliente INT,
    CONSTRAINT FK_Pedido_Cliente FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente)
)
GO

-- Tabela de ItensPedido
CREATE TABLE ItensPedido (
    ID_ItemPedido INT IDENTITY(1,1) PRIMARY KEY,
    ID_Pedido INT,
    SKU INT,
    Quantidade INT,
    CONSTRAINT FK_ItensPedido_Pedido FOREIGN KEY (ID_Pedido) REFERENCES Pedido(ID_Pedido),
    CONSTRAINT FK_ItensPedido_Produto FOREIGN KEY (SKU) REFERENCES Produto(SKU)
)
GO

-- Tabela de Movimentacao_Estoque
CREATE TABLE Movimentacao_Estoque (
    ID_Movimentacao INT IDENTITY(1,1) PRIMARY KEY,
    SKU INT,
    ID_Pedido INT,
    Quantidade INT,
    Estoque INT,
    STATUS_Pedido CHAR(1),
    CONSTRAINT FK_Movimentacao_Estoque_Produto FOREIGN KEY (SKU) REFERENCES Produto(SKU),
    CONSTRAINT FK_Movimentacao_Estoque_Pedido FOREIGN KEY (ID_Pedido) REFERENCES Pedido(ID_Pedido)
)
GO

-- Tabela de Compras
CREATE TABLE Compras (
    ID_Compra INT IDENTITY(1,1) PRIMARY KEY,
    SKU INT,
    Nome_Produto VARCHAR(100),
    Quantidade INT,
    CONSTRAINT FK_Compras_Produto FOREIGN KEY (SKU) REFERENCES Produto(SKU)
)
GO
