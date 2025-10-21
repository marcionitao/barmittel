import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SpeedDial } from '@rneui/themed';

const NewFAB = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const acao = (aAcao: string) => {
    router.push({ pathname: '/myForm', params: { acao: aAcao } });
  };

  return (
    <SpeedDial
      color="#006E61"
      icon={{ name: 'add', color: '#fff' }}
      openIcon={{ name: 'close', color: '#fff' }}
      isOpen={open}
      onOpen={() => {
        setOpen(!open);
      }}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        title="Grafico"
        icon={{ name: 'bar-chart', color: '#fff' }}
        color="orange"
        onPress={() => {
          router.push({ pathname: '/myCharts', params: { acao: 'Grafico' } });
          setOpen(!open);
        }}
      />
      <SpeedDial.Action
        title="Itens Futuros"
        icon={{ name: 'schedule', color: '#fff' }}
        color="blue"
        onPress={() => {
          router.push({ pathname: '/mySchedule', params: { acao: 'Itens Futuros' } });
          setOpen(!open);
        }}
      />
      <SpeedDial.Action
        title="Receita"
        icon={{ name: 'arrow-upward', color: '#fff' }}
        color="green"
        onPress={() => {
          acao('Receita');
          setOpen(!open);
        }}
      />
      <SpeedDial.Action
        title="Despesa"
        icon={{ name: 'arrow-downward', color: '#fff' }}
        color="red"
        onPress={() => {
          acao('Despesa');
          setOpen(!open);
        }}
      />
    </SpeedDial>
  );
};

export default NewFAB;