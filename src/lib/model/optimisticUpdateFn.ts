type OptimisticUpdateParams<T> = {
    // Обновляющая функция, предназначенная для мгновенного обновления состояния и возвращающая резервное состояние для отката
    updateFn: () => T | null;
    // Запрос, отправляемый на сервер и возвращающий Promise, обеспечивающий попытку обновления данных
    requestFn: () => Promise<any>;
    // Механизм отката, осуществляемый при ошибке запроса и принимающий сохранённое состояние для восстановления
    rollbackFn: (rollbackData: T) => void;
    
    options?: Partial<{
        // Лимит повторов, задаваемый числом максимальных попыток, применяемый для повторения запроса в случае сбоя (по умолчанию 3)
        maxRetries?: number;
        // Интервал ожидания, задаваемый в миллисекундах, обеспечивающий задержку между повторными попытками (по умолчанию 1000)
        retryDelay?: number;
        // Индикатор загрузки, управляемый через колбэк и отображающий состояние выполнения операции
        setLoading?: (loading: boolean) => void;
    }>;

};

export async function optimisticUpdate<T>({
    updateFn,
    requestFn,
    rollbackFn,
    options = {},
}: OptimisticUpdateParams<T>): Promise<void> {
    const { maxRetries = 3, retryDelay = 1000, setLoading } = options;

    if (setLoading) setLoading(true);

    const rollbackData = updateFn();

    console.log("Optimistic update")

    if (!rollbackData) {
        console.error("No rollbackdata")
        return
    };
    console.log("Rollbackdata: ",rollbackData)

    let attempt = 0;

    while (attempt < maxRetries) {
        const res = await requestFn();

        if (res.error === null) {
            if (setLoading) setLoading(false);
            console.log("Update success")
            return;
        }
        else {
            attempt++;
            console.error(`Попытка ${attempt} не удалась`, res.error);

            if (attempt < maxRetries)
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            else {
                console.error('Все попытки исчерпаны, возвращаем прежнее состояние');
                rollbackFn(rollbackData);
                if (setLoading) setLoading(false);
            }
        }
    }
}