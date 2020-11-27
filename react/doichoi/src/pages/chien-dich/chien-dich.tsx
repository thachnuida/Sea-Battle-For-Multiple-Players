import React, { useEffect, useState } from 'react';
import chienDichService from './chien-dich.service';

const ChienDich: React.FC = () => {
  const [chienDich, setChienDich] = useState<any>({});
  const [cells, setCells] = useState<any[]>([]);
  const [mode, setMode] = useState('caidat');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    // Lay thong tin chien dich
    chienDichService.detail().then((res: any) => {
        const data = res.data;
        chienDich.id = data.id;
        chienDich.so_hang = Number(data.so_hang);
        chienDich.so_cot = Number(data.so_cot);
        chienDich.so_bom_moi_doi = Number(data.so_bom_moi_doi);
        chienDich.so_may_bay_moi_doi = Number(data.so_may_bay_moi_doi);
        chienDich.so_may_bay_con_lai = data.so_may_bay_moi_doi;
        chienDich.so_bom_con_lai = data.so_bom_moi_doi;
        chienDich.so_may_bay_ban_duoc = 0;
        // setChienDich(data);


        // Generate cells        
        for (let i = 1; i <= data.so_hang; i++) {
          for (let j = 1; j <= data.so_cot; j++) {
            cells.push({
              hang: i,
              cot: j,
              style: {top: (i - 1) * 30, left: (j - 1) * 30}
            });
          }
        }
        setCells([...cells]);

        // Lay may bay hien co cua doi
        chienDichService.getAirPlane().then(({data}) => {
          data.forEach((airplane: any) => {
            let found = cells.find(cell => {
              return cell.hang == airplane.hang && cell.cot == airplane.cot;
            });
            if (found) {
              found.hasAirPlane = true;
              chienDich.so_may_bay_con_lai --;
            }
          });

          setChienDich({...chienDich});
          setCells([...cells]);
        });
    });

  }, []);

  function toggleAirPlane(cell: any) {
		let hasAirPlane = !cell.hasAirPlane;
		
		if (hasAirPlane && chienDich.so_may_bay_con_lai < 1) {
			return alert('Bạn đã dùng hết máy bay.');
		}

		cell.hasAirPlane = hasAirPlane;
    cell.isLoading = true;
    setCells([...cells]);

		chienDichService.toggleAirPlane(cell)
		.then(() => {
			cell.isLoading = false;
			
			if (hasAirPlane) {
				chienDich.so_may_bay_con_lai --;			
			} else {
				chienDich.so_may_bay_con_lai ++;
			}

      setChienDich({...chienDich});
      setCells([...cells]);      
		}, (err) => {
			if (err.response?.data?.message) {
				alert(err.response.data.message);
			} else {
				alert('Co loi khi luu thong tin may bay');
			}
			cell.isLoading = false;
      cell.hasAirPlane = !hasAirPlane;
      setCells([...cells]);
		});
	}

	// Chuyen sang che do tan cong
	function changeMode() {
		// Kiem tra da duoc tan cong chua
		chienDichService.detail()
		.then(({data}) => {
			if (data.cho_phep_tan_cong == 1) {
        
        setMode('tancong');
				// Lay bom da dat
				chienDichService.getBom()
				.then(({data}) => {
					data.forEach((bom: any) => {
						let found = cells.find(cell => {
							return cell.hang == bom.hang && cell.cot == bom.cot;
						});
						if (found) {
							found.hasBom = true;
							found.so_may_bay_ban_duoc = bom.so_may_bay_ban_duoc;
							chienDich.so_may_bay_ban_duoc +=  Number(bom.so_may_bay_ban_duoc);
							chienDich.so_bom_con_lai --;
						}

					});
          setChienDich({...chienDich});
				});
			} else {
				alert('Chua duoc phep tan cong');
			}
		});
  }
  
  function addBom(cell: any) {
		if (cell.hasBom) return;
		cell.isLoading = true;
		chienDichService.addBom(cell)
		.then((res: any) => {
      const data = res.data;
			cell.hasBom = true;
			cell.isLoading = false;
			chienDich.so_bom_con_lai --;
			chienDich.so_may_bay_ban_duoc += data.so_may_bay_ban_duoc;
      alert(`Ban trung ${data.so_may_bay_ban_duoc} may bay.`);
      
      setChienDich({...chienDich});
      setCells([...cells]);
		}, (err) => {
			if (err.response?.data?.message) {
				alert(err.response.data.message);
			} else {
				alert('Co loi khi dat bom');
			}
      cell.isLoading = false;
      setCells([...cells]);
		});
  }
  
  function viewSecret() {
    chienDichService.getSecret().then(({data}) => {
      setSecret(data.message);
    });
  }

  if (!chienDich.id) return <></>;

  return (
    <>
    {(mode === 'caidat') && (
      <div>
	      <p>Đặt máy bay: còn lại {chienDich.so_may_bay_con_lai} <button className="btn btn-sm btn-danger float-right" onClick={changeMode}>Tấn công</button></p>
        <div className="map">
          {cells.map((cell, index) => {
            return (
              <div className="cell" style={cell.style} onClick={() => toggleAirPlane(cell)} key={index}>
                {(cell.hasAirPlane && !cell.isLoading) && <img src="/img/airplane.png"/>}
                {cell.isLoading && <img src="/img/loading.gif"/>}                
              </div>
            )
          })}
        </div>
      </div>
    )}

    {(mode === 'tancong') && (
      <div>
        <p>Đặt bom: còn lại {chienDich.so_bom_con_lai} quả <span className="float-right">| Bắn được: {chienDich.so_may_bay_ban_duoc} máy bay</span></p>
        {(!chienDich.so_bom_con_lai && !secret) && <p><button className="btn btn-info" onClick={viewSecret}>Xem Thông tin mật</button></p>}
        {secret && (
          <div className="alert alert-danger" role="alert">
            {secret}
          </div>
        )}
        <div className="map">
          {cells.map((cell, index) => {
            return (
              <div className="cell cell-bom" style={cell.style} onClick={() => addBom(cell)} key={index}>
                {(cell.hasBom && !cell.isLoading) && <img src="/img/rocket.svg"/>}
                {cell.isLoading && <img src="/img/loading.gif"/>}                
              </div>
            )
          })}
        </div>
      </div>
    )}

    <img className="fake-hidden" src="/img/airplane.png"/>
    <img className="fake-hidden" src="/img/loading.gif"/>
    <img className="fake-hidden" src="/img/rocket.svg"/>
    </>
  )
}

export default ChienDich;