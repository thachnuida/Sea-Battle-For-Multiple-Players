import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import chienDichService from './chien-dich.service';
import ModalChienDich from './modal-chien-dich';

const ChienDich: React.FC = () => {
  let { id } = useParams<{id: string}>();
  const [chienDich, setChienDich] = useState<any>({});
  const [teams, setTeams] = useState<any[]>([]);
  const [newTeamName, setNewTeamName] = useState<string>('');
  const [isShowChienDichModal, setIsShowChienDichModal] = useState<boolean>(false);

  useEffect(() => {
    getInfo();
    getTeams();
  }, []);

  function getInfo() {
    chienDichService.get(id).then(response => {
      setChienDich(response.data);
    })
  }

  function getTeams() {
    chienDichService.getTeam(id).then(response => {
      setTeams(response.data);
    })
  }

  function handleAddTeamClick() {
    chienDichService.addTeam(id, newTeamName)?.then(res => {
      setTeams([...teams, res.data]);
    });
    setNewTeamName('');
  }

  function handleChienDichModalClose(value: any) {
    setIsShowChienDichModal(false);
    if (!value) return;
    chienDichService.save(value).then(res => {
      setChienDich(res.data);
    });
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h2>Chiến dịch: {chienDich.name}</h2>
        <div>
          <button className="btn btn-warning" onClick={() => setIsShowChienDichModal(true)}>Sửa</button>
        </div>
      </div>
      
      <div className="card">
        <h5 className="card-header bg-dark text-white">Thông tin chiến dịch</h5>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Trạng thái: 
              &nbsp;
              {chienDich.is_open != 0 && <span className="badge badge-success">Đang mở</span>} {chienDich.is_open == 0 && <span className="badge badge-danger">Đang đóng</span>}
              &nbsp;
              {chienDich.cho_phep_tan_cong != 0 && <span className="badge badge-warning">Đang được đặt bom</span>}
              {chienDich.cho_phep_tan_cong == 0 && <span className="badge badge-secondary">Đang KHÔNG được đặt bom</span>}
            </li>
            <li className="list-group-item">Số hàng: <span className="badge badge-info">{chienDich.so_hang}</span> - Số cột: <span className="badge badge-info">{chienDich.so_cot}</span></li>
            <li className="list-group-item">Một đội có <span className="badge badge-info">{chienDich.so_may_bay_moi_doi}</span> máy bay và <span className="badge badge-info">{chienDich.so_bom_moi_doi}</span> quả bom</li>
          </ul>
      </div>

      <div className="card mt-2">
        <div className="card-header d-flex justify-content-between  bg-dark text-white">
          <h5>Đội chơi</h5>
          <div>
            <button className="btn btn-info btn-sm" onClick={getTeams}>Làm mới</button>
          </div>
        </div>
        <div className="card-body">
          <div className="input-group">
            <input className="form-control" placeholder="Thêm đội chơi" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)}/>
            <button className="input-group-append btn btn-primary" onClick={handleAddTeamClick}>Thêm</button>
          </div>

          <table className="table table-border">
            <thead>
              <tr>
                <th>Đội chơi</th>
                <th>Mật khẩu</th>
                <th>Thành tích</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
              teams.map(team => {
                return (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.password}</td>
                    <td>Còn {team.so_may_bay_con_lai} bắn {team.so_may_bay_ban_duoc}</td>
                    <td></td>
                  </tr>
                );
              })
              }
            </tbody>
          </table>
        </div>
      </div>

      <ModalChienDich show={isShowChienDichModal} item={chienDich} onClose={(value: any) => handleChienDichModalClose(value)} />
    </div>
  )
}

export default ChienDich;