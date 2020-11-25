import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chienDichService from './chien-dich.service';
import ModalChienDich from './modal-chien-dich';

const ListChienDich: React.FC = () => {
  const [listChienDich, setListChienDich] = useState<any[]>([]);
  const [selectedChienDich, setSelectedChienDich] = useState(null);
  const [isShowChienDichModal, setIsShowChienDichModal] = useState<boolean>(false);

  useEffect(() => {
    getList()
  }, []);

  function getList() {
    chienDichService.list().then(response => {
      setListChienDich(response.data);
    });
  }

  function handleClickChienDich(item?: any) {
    if (item) {
      setSelectedChienDich(item);
    } else {
      setSelectedChienDich(null);
    }
    setIsShowChienDichModal(true);
  }

  function handleChienDichModalClose(item?: any) {
    setIsShowChienDichModal(false);
    if (!item) return;
    chienDichService.save(item).then(response => {
      if (!item.id) {
        setListChienDich([...listChienDich, response.data]);
      } else {
        setListChienDich(listChienDich.map(cd => {
          if (cd.id === item.id) {
            return {...item};
          }
          return cd;
        }));
      }
    });
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h2>Chiến Dịch</h2>
        <div className="pt-2">
          <button className="btn btn-primary" onClick={() => handleClickChienDich()}>Thêm chiến dịch</button>
        </div>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {listChienDich.map((item: any) => {
            return (
              <tr key={item.id}>
                <td>                  
                  <Link to={`/chiendich/${item.id}`}>{item.name}</Link> 
                </td>
                <td>
                  {item.is_open == 1 && <span className="badge badge-success">Mở</span>}
                  {item.is_open == 0 && <span className="badge badge-danger">Đóng</span>}
                </td>
                <td><button type="button" className="btn btn-primary btn-sm" onClick={() => handleClickChienDich(item)}>Sửa</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
        
      <ModalChienDich show={isShowChienDichModal} item={selectedChienDich} onClose={(value: any) => handleChienDichModalClose(value)} />
    </div>
  )
}

export default ListChienDich;
