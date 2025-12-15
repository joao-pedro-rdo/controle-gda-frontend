import { format } from 'date-fns';
import VisitorImage from '../VisitorImage';
import { getUserType } from '../../utils/reportHelpers';

const ReportTableRow = ({ entry, mobile = false }) => {
  const formattedTime = format(new Date(entry.time), 'HH:mm:ss');
  const formattedDate = format(new Date(entry.time), 'dd/MM/yyyy');
  const userType = getUserType(entry);

  // Badges de cor por tipo
  const typeColors = {
    Permissionário: 'bg-blue-100 text-blue-800',
    Visitante: 'bg-purple-100 text-purple-800',
    Militar: 'bg-green-100 text-green-800',
  };

  // Badges de entrada/saída
  const entryTypeColors = {
    Entrada: 'bg-green-100 text-green-800',
    Saída: 'bg-red-100 text-red-800',
  };

  if (mobile) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Foto */}
          <div className="flex-shrink-0">
            <VisitorImage
              imagePath={entry.imagePath}
              alt={`Foto de ${entry.name}`}
              boxSize="80px"
              className="rounded-lg"
            />
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {entry.name}
                </h3>
                <div className="flex gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeColors[userType]}`}>
                    {userType}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${entryTypeColors[entry.type]}`}>
                    {entry.type}
                  </span>
                </div>
              </div>
            </div>

            <dl className="space-y-1">
              <div className="flex justify-between text-xs">
                <dt className="text-gray-500">ID:</dt>
                <dd className="text-gray-900 font-medium">{entry.idNumber}</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-500">Contato:</dt>
                <dd className="text-gray-900">{entry.phoneNumber || (entry.isPermissionario ? entry.CPF : 'N/A')}</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-500">Placa:</dt>
                <dd className="text-gray-900 font-medium">{entry.licensePlate}</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-500">Veículo:</dt>
                <dd className="text-gray-900">{entry.carModel} - {entry.color}</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-500">Data/Hora:</dt>
                <dd className="text-gray-900 font-medium">{formattedDate} às {formattedTime}</dd>
              </div>
              {entry.isVisitor && entry.target && (
                <div className="flex justify-between text-xs">
                  <dt className="text-gray-500">Destino:</dt>
                  <dd className="text-gray-900">{entry.target}</dd>
                </div>
              )}
              {entry.isVisitor && entry.contactPerson && (
                <div className="flex justify-between text-xs">
                  <dt className="text-gray-500">Contato:</dt>
                  <dd className="text-gray-900">{entry.contactPerson}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 py-4 whitespace-nowrap">
        <VisitorImage
          imagePath={entry.imagePath}
          alt={`Foto de ${entry.name}`}
          boxSize="50px"
          className="rounded-lg"
        />
      </td>
      <td className="px-3 py-4">
        <div className="text-sm font-medium text-gray-900">{entry.name}</div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${typeColors[userType]}`}>
          {userType}
        </span>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.idNumber}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
        {entry.phoneNumber || (entry.isPermissionario ? entry.CPF : 'N/A')}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {entry.licensePlate}
      </td>
      <td className="px-3 py-4 text-sm text-gray-900">
        {entry.carModel} - {entry.color}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${entryTypeColors[entry.type]}`}>
          {entry.type}
        </span>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {formattedTime}
      </td>
      <td className="px-3 py-4 text-sm text-gray-900">
        {entry.isVisitor ? entry.target || 'N/A' : 'N/A'}
      </td>
    </tr>
  );
};

export default ReportTableRow;
