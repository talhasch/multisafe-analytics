import React, {useEffect, useState} from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import {DataGrid, GridColDef, GridSortItem} from '@mui/x-data-grid';
import moment from 'moment';
import {formatUnits} from './helper';
import {Network, Safe} from './types';
import {blue} from '@mui/material/colors';

function App() {
    const [network, setNetwork] = useState<Network>('mainnet');
    const [loading, setLoading] = useState(true);
    const [safes, setSafes] = useState<Safe[]>([]);
    const [sortModel, setSortModel] = useState<GridSortItem[]>([
        {
            field: 'balance',
            sort: 'desc',
        },
    ]);

    useEffect(() => {
        const fetchSafes = async () => {
            await fetch(`https://${network}-api.multisafe.xyz/safes`).then(r => r.json()).then(safes => {
                setSafes(safes)
            }).finally(() => {
                setLoading(false);
            })
        }

        fetchSafes().then();
    }, [network]);


    if (loading) {
        return null;
    }

    const columns: GridColDef[] = [
        {
            field: 'address', headerName: 'Address', sortable: false, width: 800, renderCell: p => {
                return <Box sx={{
                    color: blue['600'],
                    cursor: 'pointer',
                    ':hover': {
                        textDecoration: 'underline'
                    }
                }}>{p.value}</Box>
            }
        },
        {field: 'balance', headerName: 'Balance', width: 120, renderCell: (p) => <>{p.value} STX</>},
        {field: 'threshold', headerName: 'Threshold', width: 100},
        {field: 'nonce', headerName: 'Nonce', width: 100},
        {field: 'owners', headerName: 'Owners', width: 100},
        {field: 'version', headerName: 'Version', width: 120},
        {field: 'status', headerName: 'Status', width: 100, sortable: false},
        {
            field: 'time',
            headerName: 'Created',
            width: 210,
            renderCell: (p) => moment.unix(p.value).format('MMMM Do YYYY, h:mm a'),
        },
    ];

    const rows = safes.map(s => ({
        ...s,
        owners: s.owners.length,
        balance: formatUnits(s.balance, 6).toNumber()
    }));

    return (
        <div className="wrapper">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mb: '50px'
            }}>
                <Box component="img" src="/logo512.png" sx={{width: '140px', height: '140px', mb: '20px'}}/>
                <Typography sx={{fontSize: '24px'}}><strong>MultiSafe</strong> Analytics</Typography>
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mb: '50px'}}>
                <ButtonGroup variant="outlined" aria-label="outlined button group">
                    <Button onClick={() => {
                        setNetwork('mainnet')
                    }} variant={network === 'mainnet' ? 'contained' : 'outlined'}>Mainnet</Button>
                    <Button onClick={() => {
                        setNetwork('testnet')
                    }} variant={network === 'testnet' ? 'contained' : 'outlined'}>Testnet</Button>
                </ButtonGroup>
            </Box>
            <Box sx={{mb: '50px'}}>
                <Typography sx={{mb: '10px', fontSize: '26px', fontWeight: '600'}}>Safe List</Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={20}
                    rowsPerPageOptions={[20]}
                    disableSelectionOnClick
                    getRowId={(r) => r.address}
                    autoHeight
                    experimentalFeatures={{newEditingApi: false}}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                />
            </Box>
        </div>
    );
}

export default App;
