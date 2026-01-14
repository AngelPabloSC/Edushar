import React from "react";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";

const TableMain = (props) => {
  const {
    title,
    data,
    columns = [],
    rows = [],
    options,
    rowsSelected,
    onRowSelectionChange,
  } = props;
  const mergedOptions = {
    selectableRowsOnClick: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    filter: false,
    highlightSelectedRow: true,
    rowsSelected,
    onRowSelectionChange,
    textLabels: {
      pagination: {
        rowsPerPage: "Filas por página",
        displayRows: "de", // Por ejemplo: "1-10 de 100"
        next: "Página siguiente",
        previous: "Página anterior",
        first: "Primera página",
        last: "Última página",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver columnas",
        filterTable: "Filtrar tabla",
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "REINICIAR",
      },
      viewColumns: {
        title: "Mostrar Columnas",
        titleAria: "Mostrar/Ocultar Columnas",
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas",
      },
      body: {
        noMatch: "Lo sentimos, no se encontraron resultados.",
        toolTip: "Ordenar",
        columnHeaderTooltip: (column) => `Ordenar por ${column.label}`,
      },
    },
    ...options,
  };

  return (
    <MUIDataTable
      title={title}
      data={data}
      columns={columns}
      options={mergedOptions}
    />
  );
};

TableMain.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  options: PropTypes.object,
  rowsSelected: PropTypes.arrayOf(PropTypes.number),
  onRowSelectionChange: PropTypes.func,
};

export default TableMain;
