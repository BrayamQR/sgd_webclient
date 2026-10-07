export interface MenuOpcion {
  codOpc: string;
  desOpc: string;
  titleOpc: string;
  pathOpc: string | null;
  iconOpc: string | null;
  orderOpc: number;
}

export interface MenuGrupo {
  idGroupOpc: number;
  deGroupOpc: string;
  menuChildren: MenuOpcion[];
}
