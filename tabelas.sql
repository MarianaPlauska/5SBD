IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'CARREGAR_CLIENTES')
BEGIN
    DROP PROCEDURE CARREGAR_CLIENTES
END
GO

CREATE PROCEDURE CARREGAR_CLIENTES
AS
BEGIN
    -- Carrega os clientes da tabela de carga temporária para a tabela de Clientes
    INSERT INTO Cliente (Nome, CPF, Email, Telefone) 
    SELECT DISTINCT 
        C.CPF, 
        C.Email, 
        C.Nome_Comprador, 
        C.Telefone 
    FROM Carga C
    LEFT JOIN Cliente CL ON CL.Email = C.Email 
    WHERE CL.Email IS NULL
END
GO


IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'CARREGAR_PRODUTOS')
BEGIN
    DROP PROCEDURE CARREGAR_PRODUTOS
END
GO

CREATE PROCEDURE CARREGAR_PRODUTOS
AS
BEGIN
    -- Carrega os produtos da tabela de carga temporária para a tabela de Produtos
    INSERT INTO Produto (ID_Produto, Valor, Nome_produto, UPC, SKU) 
    SELECT DISTINCT 
        C.ID_Produto, 
        C.Valor, 
        C.Nome_Produto, 
        C.UPC, 
        C.SKU 
    FROM Carga C
    LEFT JOIN Produto P ON P.ID_Produto = C.ID_Produto
    WHERE P.ID_Produto IS NULL
END
GO




IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'CARREGAR_PEDIDOS')
BEGIN
    DROP PROCEDURE CARREGAR_PEDIDOS
END
GO

CREATE PROCEDURE CARREGAR_PEDIDOS
AS
BEGIN
    -- Carrega os pedidos da tabela de carga temporária para a tabela de Pedidos
    INSERT INTO Pedido (ID_Pedido, Data_Pedido, Pagamento_data, Valor_Total, Tipo_Entrega, Moeda, Endereco1, Endereco2, Endereco3, CEP, Cidade, UF, PAIS, ID_Cliente) 
    SELECT DISTINCT 
        C.ID_Pedido, 
        CONVERT(DATE, C.Pedido_data, 23) AS Data_Pedido, 
        CONVERT(DATE, C.Pagamento_data, 23) AS Pagamento_data, 
        0 AS Valor_Total, 
        C.Tipo_Entrega, 
        C.Moeda, 
        C.Endereco1, 
        C.Endereco2, 
        C.Endereco3, 
        C.CEP, 
        C.Cidade, 
        C.UF, 
        C.PAIS, 
        CL.ID_cliente 
    FROM Carga C
    LEFT JOIN Pedido P ON P.ID_Pedido = C.ID_Pedido 
    LEFT JOIN Cliente CL ON CL.Email = C.Email
    WHERE P.ID_Pedido IS NULL

    -- Atualiza o valor total dos pedidos
    UPDATE Pedido 
    SET Valor_Total = (
        SELECT SUM(C.Valor * C.Quantidade) 
        FROM Carga C 
        WHERE C.ID_Pedido = Pedido.ID_Pedido
    ) 
END
GO


IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'CARREGAR_iTENS_PEDIDOS')
BEGIN
    DROP PROCEDURE CARREGAR_iTENS_PEDIDOS
END
GO

CREATE PROCEDURE CARREGAR_iTENS_PEDIDOS
AS
BEGIN
    -- Carrega os itens de pedido da tabela de carga temporária para a tabela de Itens_Pedidos
    INSERT INTO Itens_Pedidos (ID_Produto, ID_Pedido, Quantidade) 
    SELECT DISTINCT 
        C.ID_Produto, 
        C.ID_Pedido, 
        C.Quantidade
    FROM Carga C
    LEFT JOIN Itens_Pedidos IP ON IP.ID_Produto = C.ID_Produto 
                                AND IP.ID_Pedido = C.ID_Pedido 
    WHERE IP.ID_Produto IS NULL
END
GO


IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'ADMNISTRAR_COMPRAS')
BEGIN
    DROP PROCEDURE ADMNISTRAR_COMPRAS
END
GO

CREATE PROCEDURE ADMNISTRAR_COMPRAS
AS
BEGIN
    -- Registra as compras de produtos com estoque negativo na tabela de Compras
    INSERT INTO Compras(ID_Produto, Nome_produto, Quantidade) 
    SELECT P.ID_Produto, P.Nome_produto, (P.Estoque * -1) + 10 AS Quantidade
    FROM Produto P
    INNER JOIN Movimentação_Estoque ME ON ME.ID_Produto = P.ID_Produto 
    WHERE P.Estoque <= 0
END
GO

IF EXISTS (SELECT 1 FROM SYS.objects WHERE TYPE = 'P' AND NAME = 'MOVIMENTAR_ESTOQUE')
BEGIN
    DROP PROCEDURE MOVIMENTAR_ESTOQUE
END
GO

CREATE PROCEDURE MOVIMENTAR_ESTOQUE
AS
BEGIN
    -- Atualiza o estoque de produtos e registra a movimentação de estoque
    UPDATE Produto 
    SET Estoque = Estoque - IP.Quantidade 
    FROM Produto P 
    INNER JOIN Itens_Pedidos IP ON P.ID_Produto = IP.ID_Produto;

    INSERT INTO Movimentação_Estoque (ID_Produto, ID_Pedido, Estoque) 
    SELECT IP.ID_Produto, IP.ID_Pedido, P.Estoque 
    FROM Produto P 
    INNER JOIN Itens_Pedidos IP ON IP.ID_Produto = P.ID_Produto 
    LEFT JOIN Pedido PE ON IP.ID_Pedido = PE.ID_Pedido 
    ORDER BY PE.Valor_Total DESC;

    UPDATE Movimentação_Estoque 
    SET Estoque = IP.Quantidade 
    FROM Movimentação_Estoque ME 
    INNER JOIN Itens_Pedidos IP ON ME.ID_Produto = IP.ID_Produto 
    WHERE ME.Estoque - IP.Quantidade >= 0;
    
    UPDATE Movimentação_Estoque 
    SET STATUS_Pedido = 'S', Estoque = ME.Estoque - IP.Quantidade 
    FROM Movimentação_Estoque ME 
    INNER JOIN Itens_Pedidos IP ON ME.ID_Pedido = IP.ID_Pedido;

    -- Verifica se há pedidos não atendidos em sua totalidade e executa a procedure ADMNISTRAR_COMPRAS
    IF(EXISTS(SELECT STATUS_Pedido FROM Movimentação_Estoque WHERE STATUS_Pedido = 'N'))
    BEGIN
        EXEC ADMNISTRAR_COMPRAS
    END
END
GO

