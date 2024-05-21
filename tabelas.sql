DECLARE @proc_name NVARCHAR(100)

-- Declaração do cursor para iterar sobre os nomes dos procedimentos
DECLARE proc_cursor CURSOR FOR
SELECT NAME
FROM SYS.objects
WHERE TYPE = 'P'
  AND NAME IN (
    'CARREGAR_CLIENTES',
    'CARREGAR_PRODUTOS',
    'CARREGAR_PEDIDOS',
    'CARREGAR_ITENS_PEDIDOS',
    'ADMNISTRAR_COMPRAS',
    'MOVIMENTAR_ESTOQUE'
)

-- Abrindo o cursor
OPEN proc_cursor

-- Pegando o primeiro nome do cursor
FETCH NEXT FROM proc_cursor INTO @proc_name

-- Loop para percorrer todos os procedimentos
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Verificação e exclusão do procedimento, se existir
    IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = @proc_name)
    BEGIN
        EXEC('DROP PROCEDURE ' + @proc_name)
    END

    -- Pegando o próximo nome do cursor
    FETCH NEXT FROM proc_cursor INTO @proc_name
END

-- Fechando e desalocando o cursor
CLOSE proc_cursor
DEALLOCATE proc_cursor

-- Recriação dos procedimentos armazenados

-- Criação do procedimento CARREGAR_CLIENTES
CREATE PROCEDURE CARREGAR_CLIENTES
AS
BEGIN
    INSERT INTO Cliente (Nome, CPF, Email, Telefone) 
    SELECT DISTINCT 
        C.Nome_Comprador, 
        C.CPF, 
        C.Email, 
        C.Telefone 
    FROM Carga C
    LEFT JOIN Cliente CL ON CL.Email = C.Email 
    WHERE CL.Email IS NULL;
END
GO

-- Criação do procedimento CARREGAR_PRODUTOS
CREATE PROCEDURE CARREGAR_PRODUTOS
AS
BEGIN
    INSERT INTO Produto (SKU, Nome_Produto, Valor) 
    SELECT DISTINCT 
        C.SKU, 
        C.Nome_Produto, 
        C.Valor 
    FROM Carga C
    LEFT JOIN Produto P ON P.SKU = C.SKU 
    WHERE P.SKU IS NULL;
END
GO

-- Criação do procedimento CARREGAR_PEDIDOS
CREATE PROCEDURE CARREGAR_PEDIDOS
AS
BEGIN
    INSERT INTO Pedido (ID_Pedido, Data_Pedido, Pagamento_data, Valor_Total, Tipo_Entrega, Moeda, Endereco1, Endereco2, Endereco3, CEP, Cidade, UF, PAIS, ID_Cliente) 
    SELECT DISTINCT 
        C.ID_Pedido, 
        CONVERT(DATE, C.Pedido_data, 103), 
        CONVERT(DATE, C.Pagamento_data, 103), 
        0,  -- Valor_Total será atualizado posteriormente
        C.Tipo_Entrega, 
        C.Moeda, 
        C.Endereco1, 
        C.Endereco2, 
        C.Endereco3, 
        C.CEP, 
        C.Cidade, 
        C.UF, 
        C.PAIS, 
        CL.ID_Cliente
    FROM Carga C
    LEFT JOIN Pedido P ON P.ID_Pedido = C.ID_Pedido 
    LEFT JOIN Cliente CL ON CL.Email = C.Email
    WHERE P.ID_Pedido IS NULL;

    -- Atualizar o valor total dos pedidos
    UPDATE Pedido 
    SET Valor_Total = (
        SELECT SUM(C.Valor * C.Quant) 
        FROM Carga C 
        WHERE C.ID_Pedido = Pedido.ID_Pedido
    );
END
GO

-- Criação do procedimento CARREGAR_ITENS_PEDIDOS
CREATE PROCEDURE CARREGAR_ITENS_PEDIDOS
AS
BEGIN
    INSERT INTO ItensPedido (ID_Pedido, SKU, Quantidade) 
    SELECT 
        C.ID_Pedido, 
        C.SKU, 
        C.Quant
    FROM Carga C;
END
GO

-- Criação do procedimento ADMNISTRAR_COMPRAS
CREATE PROCEDURE ADMNISTRAR_COMPRAS
AS
BEGIN
    INSERT INTO Compras (SKU, Nome_Produto, Quantidade) 
    SELECT P.SKU, P.Nome_Produto, (P.Estoque * -1) + 10
    FROM Produto P
    WHERE P.Estoque < 0;
END
GO

-- Criação do procedimento MOVIMENTAR_ESTOQUE
CREATE PROCEDURE MOVIMENTAR_ESTOQUE
AS
BEGIN
    -- Atualizar o estoque de produtos
    UPDATE P 
    SET P.Estoque = P.Estoque - IP.Quantidade
    FROM Produto P
    INNER JOIN ItensPedido IP ON P.SKU = IP.SKU;

    -- Registrar a movimentação de estoque
    INSERT INTO Movimentacao_Estoque (SKU, ID_Pedido, Quantidade, Estoque, STATUS_Pedido)
    SELECT IP.SKU, IP.ID_Pedido, IP.Quantidade, P.Estoque, 'N'
    FROM Produto P
    INNER JOIN ItensPedido IP ON P.SKU = IP.SKU
    ORDER BY (SELECT SUM(C.Valor * C.Quant) FROM Carga C WHERE C.ID_Pedido = IP.ID_Pedido) DESC;
END
GO
